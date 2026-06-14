# AgentAvatar Component Description

Komponent `AgentAvatar` wyświetla interaktywną, animowaną awatarkę agenta (stylizowana na kaktusa 🌵). Jest on kluczowym elementem wizualnym prezentującym obecność i status agenta.

**Główne funkcjonalności:**

- **Interakcja:** Awatarka implementuje zaawansowany mechanizm śledzenia ruchu myszy przez oczy (pupil following), co nadaje jej wrażenie "żywości".
- **Animacja:** Zawiera realistyczny efekt mrugania oczu, z różnym interwałem animacji.
- **Responsywność:** Logika komponentu uwzględnia różne systemy operacyjne (Windows, macOS, iOS) przy pozycjonowaniu elementów.
- **Personalizacja:** Tekst wyświetlany pod awatarką jest kontrolowany przez prop `hint` (domyślnie: "Agent session").

Komponent ten znacznie podnosi immersyjność interfejsu użytkownika poprzez zastosowanie subtelnych efektów animacji i reagowania na kontekst systemowy.

# Planowane funkcjonalności

- bardziej iść w kierunku imiona dla agentów - pracownicy np. "Wrzutek" może być wrzutnią
- chmurka wyświetla jego imię, lub ważne wiadomości
- np emailowy agent to koperta z oczkami
