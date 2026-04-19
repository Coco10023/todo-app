# Todo App i TypeScript

Detta projekt är en att göra-applikation byggd med TypeScript, objektorienterad programmering och LocalStorage.

## Funktioner

- Lägga till nya uppgifter
- Välja prioritet mellan 1 och 3
- Markera uppgifter som klara
- Spara uppgifter i LocalStorage
- Filtrera mellan alla, klara och ej klara uppgifter
- Redigera uppgifter
- Ta bort uppgifter
- Visa datum för skapad och slutförd uppgift
- Responsiv design för mobil och desktop

## Tekniker

- TypeScript
- HTML
- CSS
- Vite
- LocalStorage
- OOP med interface och klass

## Projektets struktur

- `Todo.ts` innehåller interfacet `Todo` och typen `Priority`
- `TodoList.ts` innehåller affärslogiken och validering
- `main.ts` hanterar DOM, events och rendering
- `style.css` innehåller layout och responsiv design

## Hur lösningen är konstruerad

Applikationen är uppdelad i två delar:

### 1. Modell och logik
I klassfilen `TodoList.ts` finns all logik för att:
- skapa todos
- kontrollera att inmatning är giltig
- markera uppgifter som klara
- redigera uppgifter
- ta bort uppgifter
- läsa och skriva till LocalStorage

Denna klass hanterar inte HTML eller DOM, vilket gör att logiken hålls separerad från presentationen.

### 2. Webbplatsen
I `main.ts` kopplas formuläret och knapparna till metoderna i `TodoList`. När användaren gör något i gränssnittet uppdateras listan på sidan genom att rendering sker i DOM.

## Validering
Validering sker i klassfilen enligt uppgiftens krav.

- Uppgift får inte vara tom
- Prioritet måste vara ett heltal mellan 1 och 3
- Om fel värden skickas in returneras `false`
- Felmeddelanden visas i webbplatsen, inte i klassfilen

## LocalStorage
Todos sparas i webbläsarens LocalStorage under nyckeln `todos`. Vid sidomladdning läses uppgifterna automatiskt tillbaka in via konstruktorn i `TodoList`.

## Installation och körning

```bash
npm install
npm run dev
