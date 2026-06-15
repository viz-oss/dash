import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useEditmodeStore = defineStore('editmode', () => {
  const editmode = ref(false)
  function toggle() {
    editmode.value = !editmode.value
  }

  return { editmode, toggle }
})
