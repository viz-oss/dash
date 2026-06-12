import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'

interface NavigatorUAData {
  platform: string
  mobile: boolean
  brands: Array<{ brand: string; version: string }>
}

interface ExtendedNavigator extends Navigator {
  userAgentData?: NavigatorUAData
}

interface UseOSReturn {
  isMac: Ref<boolean>
  isWindows: Ref<boolean>
  osName: Ref<string>
}

export function useOS(): UseOSReturn {
  const isMac = ref<boolean>(false)
  const isWindows = ref<boolean>(false)
  const osName = ref<string>('unknown')

  onMounted(() => {
    const nav = navigator as ExtendedNavigator

    if (nav.userAgentData?.platform) {
      const platform = nav.userAgentData.platform.toLowerCase()
      isMac.value = platform.includes('macos')
      isWindows.value = platform.includes('windows')
      osName.value = platform
    } else {
      const platform = nav.platform.toLowerCase()
      isMac.value = platform.includes('mac')
      isWindows.value = platform.includes('win')
      osName.value = isMac.value ? 'macos' : isWindows.value ? 'windows' : 'unknown'
    }
  })

  return { isMac, isWindows, osName }
}
