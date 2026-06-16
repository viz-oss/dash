---
name: component-template
description: 'Guides the user through creating a new Vue 3 component that adheres to project conventions (Composition API, TypeScript, Scoped CSS). Use when the user asks to create a new component from scratch.'
metadata:
  version: 0.1
---

**Workflow & Steps:**

1.  **Gather Requirements:** Ask the user for:
    - The desired name and location of the component (e.g., `src/components/NewFeatureCard.vue`).
    - A detailed description of the component's functionality.
    - Required data, props, or services it needs to interact with.

2.  **Generate Component Shell:** Generate a robust component shell (`<template>`, `<script setup lang="ts">`, `<style scoped>`) based on the requirements.

Base template:

```vue
<script setup lang="ts">
import { useEditmodeStore } from '../stores/editmode'

const editmodeStore = useEditmodeStore()
const randomFloatDelay = `${Math.round((Math.random() * 2 - 1) * 100) / 100}s`

defineProps({
  // Define props here based on user requirements
})
</script>

<template>
  <div
    :class="'card' + (editmodeStore.editmode ? ' editmode' : '')"
    :style="{ '--float-delay': randomFloatDelay }"
  >
    <i v-if="editmodeStore.editmode" class="close fa-solid fa-xmark"></i>

    <!-- Add component-specific template content here based on user requirements -->
  </div>
</template>

<style scoped>
/* Add component-specific styles here based on user requirements */
</style>
```

3.  **Populate Logic:** Fill in the template logic using TypeScript/Vue 3 Composition API patterns observed in existing files (e.g., using `ref()`, `computed()`, lifecycle hooks).

4.  **Refine Styling:** Generate appropriate CSS structure and apply scoped styling, mimicking existing design systems (e.g., shadow colors, spacing, flex layouts used in other components like `StatCard.vue`). Global CSS variables and classes are defined in the `App.vue`.

5.  **Output:** Present the complete, ready-to-use Vue component code to the user and suggest the file write operation.

**Example Usage:**
User: "I need a new card component for displaying product information."
_Action:_ Use this skill to guide the creation process, starting by defining required props like `productName`, `price`, and `imageUrl`.
