<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { parseCurlToFetch } from '@/utils/curlParser'

type MessagePart =
  | { type: 'text'; content: string }
  | { type: 'external-link'; href: string; label: string }
  | { type: 'command'; command: string; label: string }

type ChatMessage = { sender: 'me' | 'other'; text: string; parts: MessagePart[] }

// Props definition
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  systemPrompt: {
    type: String,
    required: false,
    default: '',
  },
  command: {
    type: String,
    required: false,
    default: '',
  },
})

// Generate session ID for tracking conversations
const ssid = crypto.randomUUID()

const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
const rawHttpRegex = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/g

// State management
const messages = ref<ChatMessage[]>([])
const messageInput = ref('')
const isLoadingTyping = ref(false)
const systemPromptSent = ref(false) // Track if system prompt has been sent

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value)

const parseRawHttpLinks = (text: string) => {
  const parts: MessagePart[] = []
  let lastIndex = 0
  rawHttpRegex.lastIndex = 0

  for (const match of text.matchAll(rawHttpRegex)) {
    const start = match.index ?? 0
    const url = match[0]

    if (start > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, start) })
    }

    parts.push({ type: 'external-link', href: url, label: '' })
    lastIndex = start + url.length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return parts
}

const parseMessageParts = (text: string) => {
  const parts: MessagePart[] = []
  let lastIndex = 0
  markdownLinkRegex.lastIndex = 0

  for (const match of text.matchAll(markdownLinkRegex)) {
    const start = match.index ?? 0
    const label = (match[1] || '').trim()
    const target = (match[2] || '').trim()

    if (start > lastIndex) {
      parts.push(...parseRawHttpLinks(text.slice(lastIndex, start)))
    }

    if (target) {
      if (isHttpUrl(target)) {
        parts.push({ type: 'external-link', href: target, label: label || target })
      } else {
        parts.push({ type: 'command', command: target, label: label || target })
      }
    } else if (match[0]) {
      parts.push({ type: 'text', content: match[0] })
    }

    lastIndex = start + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(...parseRawHttpLinks(text.slice(lastIndex)))
  }

  if (!parts.length) {
    return [{ type: 'text', content: text }] as MessagePart[]
  }

  return parts
}

// Focus the input field on component mount
onMounted(() => {
  // Send initial message
  if (props.command) {
    send(props.command)
  }
  // Focus the input field when the component is mounted
  const inputElement = document.querySelector<HTMLInputElement>('.chat-actions input')
  if (inputElement) {
    inputElement.focus()
  }
})

/**
 * Displays a message bubble. Visual only.
 * @param {string} text - The content of the message.
 * @param {'left' | 'right'} position - Alignment ('left' or 'right').
 */
const msg = (text: string, position: 'left' | 'right', hidden = false) => {
  if (!hidden) {
    messages.value.push({
      sender: position === 'right' ? 'me' : 'other',
      text: text,
      parts: parseMessageParts(text),
    })
  }
}

const openExternalLink = (href: string) => {
  window.open(href, '_blank', 'noopener,noreferrer')
}

/**
 * Displays the typing indicator widget. Visual only.
 * @param {boolean} isTyping - Whether to show the typing state.
 * @param {'left' | 'right'} position - Alignment ('left' or 'right'). (Note: based on requirement, this will likely be 'left')
 */
const typing = (isTyping: boolean, position: 'left' | 'right') => {
  // For simplicity in this component structure, we only update a state flag for the UI
  isLoadingTyping.value = isTyping
}

/**
 * Main method to send a message and handle response flow.
 * @param {string} text - The message content to send.
 */
const send = async (text: string) => {
  if (!props.url || !text) return

  // Clear the input field after sending
  messageInput.value = ''

  // 1. Display our msg on the right
  msg(text, 'right')

  // 2. Send message to URL and show typing indicator on the left
  typing(true, 'left')
  const prompt =
    !systemPromptSent.value && props.systemPrompt
      ? `${props.systemPrompt.replace(/\n/g, ' ')} ${text}`
      : text
  systemPromptSent.value = true
  const { url, options } = parseCurlToFetch(props.url, { PROMPT: prompt, THREAD_ID: ssid })
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    let botResponseText = ''
    const data = await response.json()
    if (data?.status === 'processing') botResponseText = 'Odpowiedź w trakcie generowania...'
    else if (data?.status === 'ok')
      botResponseText = data?.payload?.text || 'Nie udało się odebrać odpowiedzi.'
    else if (data?.status === 'error')
      botResponseText = `Błąd: ${data?.payload?.error || 'Nieznany błąd'}`
    else botResponseText = 'Nie udało się odebrać odpowiedzi.'

    // 3. Display response on the left
    msg(botResponseText, 'left')
  } catch (error: any) {
    console.error('Error sending message:', error)
    msg(`Błąd komunikacji: ${error.message}`, 'left')
  } finally {
    // 4. Hide typing indicator
    typing(false, 'left')
  }
}
</script>

<template>
  <div class="chat-container">
    <div class="message-list">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message-bubble', msg.sender === 'me' ? 'right' : 'left']"
      >
        <template v-for="(part, partIndex) in msg.parts" :key="`${index}-${partIndex}`">
          <span v-if="part.type === 'text'">{{ part.content }}</span>

          <button
            v-else-if="part.type === 'command'"
            class="message-link-button"
            type="button"
            :title="part.command"
            @click="send(part.command)"
          >
            {{ part.label }}
          </button>

          <button
            v-else
            class="message-link-button"
            type="button"
            :title="part.href"
            @click="openExternalLink(part.href)"
          >
            <template v-if="part.label">
              {{ part.label }}
            </template>
            <template v-else>
              <i class="fa-solid fa-link"></i>
            </template>
          </button>
        </template>
      </div>
      <!-- Typing Indicator -->
      <div v-if="isLoadingTyping" class="message-bubble left typing-indicator">
        <div style="padding: 0 8px; font-size: 14px">
          <span class="dot">&bull;</span>
          <span class="dot">&bull;</span>
          <span class="dot">&bull;</span>
        </div>
      </div>
    </div>

    <!-- Message Input Area -->
    <div class="chat-actions">
      <input
        v-model="messageInput"
        @keyup.enter="send(messageInput)"
        type="text"
        name="chat-message"
        placeholder="Type your message..."
        autocomplete="off"
        autocapitalize="sentences"
        data-lpignore="true"
      />
    </div>
  </div>
</template>

<style scoped>
/* The component should have full width and 75% height of the whole window */
.chat-container {
  width: calc(100% - 2px);
  height: 75vh; /* Using vh for example, assuming 'whole screen' context */
  display: flex;
  flex-direction: column;
  border: var(--field-border);
  border-radius: 14px;
  margin-bottom: 8px;
}

.message-list {
  flex-grow: 1;
  padding: 15px;
  overflow-y: auto;
}

/* Message Bubble Styling (General) */
.message-bubble {
  width: fit-content;
  padding: 10px 15px;
  margin-bottom: 15px;
  border-radius: 20px;
  line-height: 1.4;
  font-size: 14px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.message-link-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0 3px;
  padding: 4px 10px;
  border-radius: 12px;
  border: var(--field-border);
  background-color: var(--key-color-light);
  color: var(--key-color-dark);
  cursor: pointer;
  font-size: 13px;
}

.message-link-button:hover {
  filter: brightness(0.97);
}

/* Right aligned messages (User) */
.message-bubble.right {
  background-color: var(--key-color-light);
  margin-left: auto;
  text-align: right;
}

/* Left aligned messages (Bot/System) */
.message-bubble.left {
  background-color: var(--white-color);
  border: 1px solid #eee;
  margin-right: auto;
  text-align: left;
}

/* Typing Indicator Styling */
.typing-indicator {
  display: flex;
  align-items: center;
  padding: 5px 0;
}

.dot {
  font-size: 1.2em;
  margin-right: 3px;
  animation: blink 1s linear infinite;
}
/* Delaying animation for staggering effect */
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* Actions/Send area */
.chat-actions {
  padding: 10px;
}

.chat-actions input {
  width: calc(100% - 32px);
  padding: 13px 15px;
  border: var(--field-border);
  border-radius: 20px;
  font-size: 14px;
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.02),
    0 4px 12px rgba(15, 23, 42, 0.03);
}

.chat-actions input:focus {
  outline: none;
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow:
    0 0 0 2px rgba(139, 92, 246, 0.08),
    0 10px 16px rgba(139, 92, 246, 0.12);
}
</style>
