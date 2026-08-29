# QuestBoard – dein persönliches Dashboard

## Schnellstart (online testen, ohne Installation)
1. Gehe auf https://stackblitz.com
2. Klicke auf "New Project" → "Vite" → "React"
3. Ersetze den Inhalt der Dateien im neuen Projekt durch die Dateien aus diesem Ordner
   (index.html, vite.config.js, package.json, src/App.jsx, src/main.jsx)
4. StackBlitz startet die App automatisch und zeigt dir einen Link, den du auch auf
   dem Handy öffnen kannst.

## Als echte, installierbare App online bringen
1. Lege (am besten mit einem Elternteil) einen kostenlosen Account auf
   https://vercel.com oder https://netlify.com an.
2. Lade dieses gesamte Projekt als Ordner/ZIP hoch (beide Dienste bieten
   "Deploy from ZIP" bzw. Drag & Drop des Projektordners an).
3. Der Dienst erkennt automatisch, dass es ein Vite-Projekt ist, baut es und gibt
   dir eine eigene Internetadresse (z. B. quest-dashboard.vercel.app).
4. Öffne diese Adresse auf deinem Handy im Browser.
5. Menü öffnen → "Zum Startbildschirm hinzufügen" (iPhone: Teilen-Symbol →
   "Zum Home-Bildschirm") – fertig! Die App hat jetzt ein eigenes Icon und
   startet wie eine echte App.

## Lokal auf dem PC starten
1. Node.js installieren: https://nodejs.org (LTS-Version)
2. In diesem Ordner ein Terminal öffnen und ausführen:
   npm install
   npm run dev
3. Der angezeigte Link (meist http://localhost:5173) öffnet die App im Browser.

## Hinweis
Alle Daten werden nur lokal im Browser gespeichert (localStorage). Wenn du die
App auf einem anderen Gerät öffnest, startest du dort mit leeren Daten.
