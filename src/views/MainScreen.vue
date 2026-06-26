<script setup lang="ts">
import { ref, type Component } from 'vue'
import { GridItem, GridLayout } from 'grid-layout-plus'
import type { Layout } from 'grid-layout-plus'
import AddNewTileButton from '@/components/tiles/AddNewTileButton.vue'
import { useEditmodeStore } from '@/stores/editmode'

type TileDefinition = {
  component: Component
  props?: Record<string, unknown>
}

const props = defineProps<{
  tiles: Record<string, TileDefinition>
  layout: Layout
}>()

const layoutModel = ref<Layout>([...props.layout])
const editmodeStore = useEditmodeStore()

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
    >
      <div class="tile-frame" :class="{ 'tile-frame--drag': editmodeStore.editmode }">
        <component
          :id="item.i"
          :is="tiles[String(item.i)]?.component"
          v-bind="tiles[String(item.i)]?.props"
          @remove="removeTile(item.i)"
        />
      </div>
    </GridItem>
  </GridLayout>
  <AddNewTileButton v-if="editmodeStore.editmode" />
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
