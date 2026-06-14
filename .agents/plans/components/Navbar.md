# Navbar

Dolny pasek nawigacyjny to przełączanie workspaców, każdy ma swoją ikonę a po bokach zamieniają się w kropki i można hoiryzontalnie scrollować lub tapnąć, a na końcu z prawej plusik (we free plusik prowadzi do bannera z ofertami cenowymi kup pełną wersję),

- da się go natywnie zrobić (na iOS glass) bo capacitor pozwala na natywne pluginy, ale to potem, bo muszę to zrobić samemu gdyż to nie jest prawdziwy navbar tylko pagination dots
- Możesz stworzyć całą strukturę (swipowane ekrany + pasek z kropkami) w kodzie webowym. Aby działało to ultra-płynnie i miało natywny feeling, najlepiej użyć biblioteki Swiper.js (lub wbudowanego w Ionic komponentu ion-slides / Swiper integration).
  Główny kontener (Swiper): Rozciągasz go na cały ekran (100vh/100vw). Każdy "dashboard" to osobny slajd.
  Dolny pasek: Pozycjonujesz go za pomocą position: absolute; bottom: 20px;.
  Efekt Liquid Glass + Kropki: Wewnątrz tego paska umieszczasz element paginacji Swipera. Pasek stylizujesz w CSS za pomocą backdrop-filter: blur(20px) saturate(180%); oraz lekkiego, półprzezroczystego tła, co da niemal idealną imitację szkła.
  Jeśli dashboardów będzie dużo (więcej niż 5), koniecznie włącz opcję dynamicznych kropek (dynamicBullets: true w Swiper.js)
