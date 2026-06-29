<script setup lang="ts">
import { ref } from 'vue'
import { GridItem, GridLayout } from 'grid-layout-plus'
import { useEditmodeStore } from '@/stores/editmode'
import { tileDefinitions, type DesktopLayout } from '@/types/desktop'

const props = defineProps<{
  layout: DesktopLayout
}>()

const layoutModel = ref<DesktopLayout>([...props.layout])
const editmodeStore = useEditmodeStore()
const isTileDragging = ref(false)
const suppressTileClickUntil = ref(0)

function onTileMove() {
  isTileDragging.value = true
}

function onTileMoved() {
  isTileDragging.value = false
  suppressTileClickUntil.value = Date.now() + 180
}

function preventClickAfterDrag(event: MouseEvent) {
  if (isTileDragging.value || Date.now() < suppressTileClickUntil.value) {
    event.preventDefault()
    event.stopPropagation()
  }
}

function addTile(tileType: string) {
  const newTile = {
    i: `${tileType}-${crypto.randomUUID()}`,
    tile: tileType,
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    minW: 1,
    minH: 1,
    maxW: 3,
    maxH: 4,
  }
  layoutModel.value.push(newTile)
}

function removeTile(id: string | number) {
  if (confirm('Are you sure you want to remove this tile?')) {
    layoutModel.value = layoutModel.value.filter((item) => item.i !== id)
  }
}
</script>

<template>
  <GridLayout
    v-model:layout="layoutModel"
    :col-num="3"
    :row-height="50"
    :margin="[4, 16]"
    :is-draggable="editmodeStore.editmode"
    :is-resizable="editmodeStore.editmode"
    :prevent-collision="false"
    :vertical-compact="false"
    :use-css-transforms="true"
    :responsive="false"
    class="dashboard-grid"
    :class="editmodeStore.editmode ? 'editmode' : ''"
  >
    <GridItem
      v-for="item in layoutModel"
      :key="item.i"
      v-bind="item"
      drag-ignore-from=".close, .bottom-sheet, .chat"
      @move="onTileMove"
      @moved="onTileMoved"
    >
      <div
        class="tile-frame"
        :class="{ 'tile-frame--drag': editmodeStore.editmode }"
        @click.capture="preventClickAfterDrag"
      >
        <component
          :id="item.i"
          :is="tileDefinitions[item.tile]"
          @remove="removeTile(item.i)"
        />
        <!-- dodać v-bind="item.i -> props" -->
      </div>
    </GridItem>
  </GridLayout>
</template>

<style>
.dashboard-grid {
  width: 100%;
}

.tile-frame {
  width: 100%;
  height: 100%;
}

.tile-frame--drag {
  cursor: move;
}
</style>
