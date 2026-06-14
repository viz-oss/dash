# Chat

Komponent VUE3 do chatu, który osadza się np. w BottomSheet

Plik: [src\components\Chat.vue]

# Plan

Komponent powinien mieć pełną szerokość swojego kontenera oraz wysokość 75% całego okna.

## Parametry

- url: endpoint komunikacyjny

## Metody

- msg(text, position): generyczne wyswietlenie bąbla z wiadomością position 'left' lub 'right' (tylko wizualny)
- typing(bool, position): wyświetlanie widgetu trzech podskakujacych kulek (tylko wizualny)
- send(text): główna metoda orkiestrująca całość
  - wyświetlenie naszego msg po prawej stronie
  - wysłanie wiadomości na url
  - wyswietlenie po lewej stronie typing
  - odebranie odpowiedzi i wyświetlenie jej po prawej stronie
