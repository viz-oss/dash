// src/types/vue-bottom-sheet.d.ts
declare module '@webzlodimir/vue-bottom-sheet' {
  import type { DefineComponent } from 'vue'

  export type VueBottomSheetRef = {
    open: () => void
    close: () => void
  }

  const VueBottomSheet: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    unknown,
    Record<string, never>,
    Record<string, never>,
    Record<string, never>,
    Record<string, never>,
    {
      opened: () => void
      closed: () => void
    }
  >
  export default VueBottomSheet
}
