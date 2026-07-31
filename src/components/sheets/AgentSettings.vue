<script setup lang="ts">
import { ref } from 'vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const props = defineProps({
  widgetId: {
    type: String,
    required: true,
  },
})

const workspaceStore = useWorkspaceStore()
const { updateWidget } = workspaceStore
const workspaceIndex = ref(
  workspaceStore.workspaces.findIndex((workspace) =>
    workspace.some((item) => item.i === props.widgetId),
  ),
)
const widget = ref(workspaceStore.workspaces.flat().find((item) => item.i === props.widgetId))

const form = ref({
  url: widget.value?.props?.url || '',
  systemPrompt: widget.value?.props?.systemPrompt || '',
  command: widget.value?.props?.command || '',
})

const emit = defineEmits(['close'])

function save() {
  updateWidget(workspaceIndex.value, props.widgetId, form.value)
  close()
}

function close() {
  // Remove focus to prevent aria-hidden warning when sheet closes
  ;(document.activeElement as HTMLElement)?.blur()
  emit('close')
}
</script>

<template>
  <div class="sheet-content">
    <div class="sheet-header">
      <i class="icon fa-solid fa-gear"></i>
      <div class="about">
        <div class="title">Agent Settings</div>
        <div class="subtitle">Customize your agent preferences</div>
      </div>
    </div>
    <div class="field">
      <label>Agent Connection URL</label>
      <input
        type="text"
        v-model="form.url"
        placeholder="API endpoint or CURL with variables: PROMPT, THREAD_ID"
      />
    </div>
    <div class="field">
      <label>System prompt</label>
      <textarea v-model="form.systemPrompt" placeholder="System prompt for the agent"></textarea>
    </div>
    <div class="field">
      <label>Initial command</label>
      <input
        type="text"
        v-model="form.command"
        placeholder="Initial command to run when the agent starts"
      />
    </div>
    <div class="sheet-footer">
      <button class="btn btn-secondary" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="save">Save Changes</button>
    </div>
  </div>
</template>
