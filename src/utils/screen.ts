/**
 * Blocks all popular browser zoom methods:
 *  - pinch-zoom (two fingers) on mobile
 *  - double-tap zoom on mobile (Safari/iOS)
 *  - Ctrl + scroll (mouse wheel) on desktop
 *  - Ctrl/Cmd + "+" / "-" / "0" (keyboard) on desktop
 *  - gesturestart/change/end (Safari iOS)
 *
 * Call disableBrowserZoom() once, e.g., at the start of the game.
 */

export function disableBrowserZoom() {
    // 1. Force viewport without scaling option
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!viewport) {
        viewport = document.createElement('meta') as HTMLMetaElement;
        viewport.setAttribute('name', 'viewport');
        document.head.appendChild(viewport);
    }
    viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
    );

    // 2. touch-action: manipulation blocks native pinch-zoom and double-tap-zoom
    document.documentElement.style.touchAction = 'manipulation';
    document.body.style.touchAction = 'manipulation';

    // 3. Block gestures (Safari iOS sends these events on pinch)
    ['gesturestart', 'gesturechange', 'gestureend'].forEach((evt) => {
        document.addEventListener(evt, (e) => e.preventDefault(), { passive: false });
    });

    // 4. Block multi-touch pinch-zoom (mainly Android/Chrome)
    document.addEventListener(
        'touchstart',
        (e) => {
            if (e.touches.length > 1) e.preventDefault();
        },
        { passive: false }
    );

    document.addEventListener(
        'touchmove',
        (e) => {
            if (e.touches.length > 1) e.preventDefault();
        },
        { passive: false }
    );

    // 5. Block double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener(
        'touchend',
        (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        },
        { passive: false }
    );

    // 6. Block zoom on desktop: Ctrl + scroll (mouse wheel / trackpad pinch in Chrome)
    document.addEventListener(
        'wheel',
        (e) => {
            if (e.ctrlKey) e.preventDefault();
        },
        { passive: false }
    );

    // 7. Block zoom via keyboard: Ctrl/Cmd + "+", "-", "=", "_", "0"
    document.addEventListener('keydown', (e) => {
        const zoomKeys = ['+', '-', '=', '_', '0'];
        if ((e.ctrlKey || e.metaKey) && zoomKeys.includes(e.key)) {
            e.preventDefault();
        }
    });
}
