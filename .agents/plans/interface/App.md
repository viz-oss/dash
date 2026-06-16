# App

## Layout całości

Chcę aby główny panel aplikacji to były konfigurowalne kafelki z 3 slotami w rzędzie.
Kafelki mogą zajmować 1, 2 lub 3 sloty.
w Trybie editmode z Pinia kafelki mają się pozwalać dowolnie przesuwać z kolizjami aby użytkownik układał nowy layout.
Zapisywanie układu w persistent config na razie jest nieistotne.
Rozważ użycie biblioteki vue-grid-layout lub lepszej jeśli istnieje.

W App vue są już kafelki:
WorkspaceNav, TrendChart
3x StatCard (zapewne nie powinny być zablokowane w <div class="row">)
RingChart i AgentAvatar (zapewne nie powinny być zablokowane w <div class="row">)
Landscape
