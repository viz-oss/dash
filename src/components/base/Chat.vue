<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Props definition
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
})

// Generate session ID for tracking conversations
const ssid = crypto.randomUUID()

// State management
const messages = ref<{ sender: 'user' | 'bot'; text: string }[]>([])
const messageInput = ref('')
const isLoadingTyping = ref(false)

// Focus the input field on component mount
onMounted(() => {
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
const msg = (text: string, position: 'left' | 'right') => {
  messages.value.push({ sender: position === 'right' ? 'user' : 'bot', text: text })
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
  try {
    const response = await fetch(
      props.url.replace('%message%', encodeURIComponent(text)).replace('%ssid%', ssid),
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    // Assuming the API returns a structure with the reply content
    const botResponseText = data.reply || 'Nie udało się odebrać odpowiedzi.'

    // 3. Wait for reception and display response on the right
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay
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
        :class="['message-bubble', msg.sender === 'user' ? 'right' : 'left']"
      >
        {{ msg.text }}
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
        placeholder="Type your message..."
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
  max-width: 70%;
  width: fit-content;
  padding: 10px 15px;
  margin-bottom: 15px;
  border-radius: 20px;
  line-height: 1.4;
  font-size: 14px;
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
