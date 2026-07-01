/// <reference types="vite/client" />
import 'pinia-plugin-persistedstate'

declare module '@webzlodimir/vue-bottom-sheet' {
  import type { DefineComponent } from 'vue'

  const VueBottomSheet: DefineComponent<{}, {}, any>
  export default VueBottomSheet
}

declare module '@webzlodimir/vue-bottom-sheet/dist/vue-bottom-sheet.es.js' {
  import type { DefineComponent } from 'vue'

  const VueBottomSheet: DefineComponent<{}, {}, any>
  export default VueBottomSheet
}
