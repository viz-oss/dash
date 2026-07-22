<script setup lang="ts">
import { ref } from 'vue'
import { GridItem, GridLayout } from 'grid-layout-plus'
import { useEditmodeStore } from '@/stores/editmode'
import { useDesktopStore } from '@/stores/desktopStore'
import { tileDefinitions, type DesktopLayout } from '@/types/desktop'
import TopNav from '@/components/nav/TopNav.vue'
import inobounce from 'inobounce'

const props = defineProps<{
  layout: DesktopLayout
  index: number
}>()

const layoutModel = ref<DesktopLayout>([...props.layout])
const editmodeStore = useEditmodeStore()
const desktopStore = useDesktopStore()
const { updateDesktop } = desktopStore
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
    w: tileDefinitions[tileType]?.w || 1,
    h: tileDefinitions[tileType]?.h || 1,
    minW: tileDefinitions[tileType]?.minW || 1,
    minH: tileDefinitions[tileType]?.minH || 1,
    maxW: tileDefinitions[tileType]?.maxW || 1,
    maxH: tileDefinitions[tileType]?.maxH || 1,
  }
  layoutModel.value.push(newTile)
  updateDesktop(props.index, layoutModel.value)
}

function removeTile(id: string | number) {
  if (confirm('Are you sure you want to remove this tile?')) {
    layoutModel.value = layoutModel.value.filter((item) => item.i !== id)
    updateDesktop(props.index, layoutModel.value)
  }
}

const dragOptions = {
  onstart: () => {
    document.body.classList.add('body-no-scroll')
    inobounce.enable();
  },
  onend: () => {
    document.body.classList.remove('body-no-scroll')
    inobounce.disable();
  },
  autoScroll: false,
};
</script>

<template>
  <TopNav :id="`topnav-${props.index}`" :desktop-index="props.index" @add="addTile" />
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
      :drag-option="dragOptions"
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
          :is="tileDefinitions[item.tile]?.component"
          v-bind="item.props"
          @remove="removeTile(item.i)"
        />
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
