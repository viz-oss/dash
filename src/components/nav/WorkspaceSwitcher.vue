<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import NavBar from '@/components/nav/NavBar.vue'
import type { WorkspaceLayout } from '@/types/workspace'
import { useEditmodeStore } from '@/stores/editmode'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const props = defineProps<{
  workspaces: WorkspaceLayout[]
}>()

const emit = defineEmits(['change'])
const editmodeStore = useEditmodeStore()
const workspaceStore = useWorkspaceStore()
const current = ref(0)
const pendingProgrammaticIndex = ref<number | null>(null)
const workspaceKeys = ref<number[]>([])
let nextWorkspaceKey = 0

function syncWorkspaceKeys(length: number) {
  while (workspaceKeys.value.length < length) {
    workspaceKeys.value.push(nextWorkspaceKey++)
  }
  if (workspaceKeys.value.length > length) {
    workspaceKeys.value.splice(length)
  }
}

watch(
  () => props.workspaces.length,
  (length) => syncWorkspaceKeys(length),
  { immediate: true },
)

// --- Navigation ---

function goTo(index: number) {
  const total = props.workspaces.length
  const next = Math.max(0, Math.min(total - 1, index))
  if (next === current.value) return
  pendingProgrammaticIndex.value = next
  current.value = next
  scrollTo(next, true)
  emit('change', next)
}

function scrollTo(index: number, smooth = true) {
  const container = document.querySelector('.workspaces-container') as HTMLElement | null
  if (!container) return
  const workspace = container.querySelectorAll('.workspace')[index]
  workspace?.scrollIntoView({
    behavior: smooth ? 'smooth' : 'instant',
    block: 'nearest',
    inline: 'start',
  })
}

// --- Change ---

// Switch places with workspace on the left side
function moveLeft() {
  if (current.value > 0) {
    const index = current.value
    workspaceStore.moveWorkspaceLeft(index)

    const keyTemp = workspaceKeys.value[index - 1]!
    workspaceKeys.value[index - 1] = workspaceKeys.value[index]!
    workspaceKeys.value[index] = keyTemp

    goTo(current.value - 1)
  }
}

// Switch places with workspace on the right side
function moveRight() {
  if (current.value < props.workspaces.length - 1) {
    const index = current.value
    workspaceStore.moveWorkspaceRight(index)

    const keyTemp = workspaceKeys.value[index + 1]!
    workspaceKeys.value[index + 1] = workspaceKeys.value[index]!
    workspaceKeys.value[index] = keyTemp

    goTo(current.value + 1)
  }
}

// Add a new workspace with an empty layout
async function addNew() {
  workspaceStore.addWorkspace([])
  workspaceKeys.value.push(nextWorkspaceKey++)
  await nextTick()
  goTo(props.workspaces.length - 1)
}

// Delete the current workspace
function deleteCurrent() {
  if (confirm('Are you sure you want to delete this workspace?')) {
    const deletingIndex = current.value
    workspaceKeys.value.splice(deletingIndex, 1)
    workspaceStore.removeWorkspace(deletingIndex)
    syncWorkspaceKeys(props.workspaces.length)

    if (current.value >= props.workspaces.length) {
      current.value = Math.max(0, props.workspaces.length - 1)
    }

    goTo(current.value)
  }
}

// --- IntersectionObserver: sync current ---

let observer: IntersectionObserver | null = null

onMounted(() => {
  const container = document.querySelector('.workspaces-container') as HTMLElement | null
  if (!container) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number((entry.target as HTMLElement).dataset.index)
          if (pendingProgrammaticIndex.value !== null && index !== pendingProgrammaticIndex.value) {
            return
          }
          if (!isNaN(index) && index !== current.value) {
            current.value = index
            emit('change', index)
          }
          if (index === pendingProgrammaticIndex.value) {
            pendingProgrammaticIndex.value = null
          }
        }
      })
    },
    { root: container, threshold: 0.6 },
  )

  container.querySelectorAll('.workspace').forEach((el) => observer?.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="workspaces-container">
    <div
      class="workspace"
      v-for="(workspace, index) in workspaces"
      :key="workspaceKeys[index]"
      :data-index="index"
    >
      <slot :workspace="workspace" :index="index" />
    </div>
  </div>
  <NavBar
    v-if="workspaces.length > 1 || editmodeStore.editmode"
    :total="workspaces.length"
    :current="current"
    :swipe-threshold="20"
    @go-to="goTo"
    @move-left="moveLeft"
    @move-right="moveRight"
    @add-next="addNew"
    @delete-current="deleteCurrent"
  />
</template>

<style>
.workspaces-container {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}

.workspace {
  flex: 0 0 100vw;
  scroll-snap-align: start;
  overflow: hidden;
}
</style>
