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
    let platform: string;

    if (nav.userAgentData?.platform) {
      platform = nav.userAgentData.platform.toLowerCase();
    } else if (nav.platform) {
      platform = nav.platform.toLowerCase();
    } else {
      platform = 'unknown';
    }

    isMac.value = false;
    isWindows.value = false;

    if (platform.includes('mac') || platform.includes('macos')) {
      isMac.value = true;
      osName.value = 'macOS';
    } else if (platform.includes('win') || platform.includes('windows')) {
      isWindows.value = true;
      osName.value = 'Windows';
    } else if (platform.includes('android')) {
      osName.value = 'Android';
    } else if (platform.includes('ios') || platform.includes('ipad')) {
      osName.value = 'iOS';
    } else if (platform.includes('linux')) {
      osName.value = 'Linux';
    } else {
      // Fallback to the detected platform name or a generic message
      osName.value = platform.length > 10 ? platform : 'unknown_os';
    }
  })

  return { isMac, isWindows, osName }
}
