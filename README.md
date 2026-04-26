# 2k/6k Practice Tool

Practice hiragana readings from an Anki-exported Core 2k/6k text deck. Import a `.txt` export, choose which cards to practice, type the reading in romaji, and review your score, time, and missed words at the end.

## How to Use

### 1. Import Screen

![Import screen](<Import Screen.png>)

Use `Select .txt file` to choose the Anki text export, then click `Import deck`. The app parses the exported deck and moves to card selection when the file is valid.

### 2. Card Selection Screen

![Card selection screen](<Card selection screen.png>)

Select which cards should appear in the session. `Select all` and `Unselect all` quickly toggle the full deck. The `Options` menu lets you show or hide translations, show or hide example phrases, and randomize the card order before practice starts.

### 3. Practice Screen

![Practice screen](<Practice screen.png>)

Type the hiragana reading in romaji. Press `Enter` once to submit, then press `Enter` again to move to the next card. The screen shows your current card number and running score, and each answer is marked right or wrong before you continue.

### 4. Session Complete Screen

![Session complete screen](<Session complete screen.png>)

The final screen shows your total score, elapsed time, and the words you missed with their correct Japanese readings. Use `Restart` to practice the same selection again or `Import again` to start over with a new deck.

## Backend

Open `TwoKSixKPractice.sln` and run `TwoKSixKPractice.Api` as the startup project.

From a terminal, the equivalent command is:

```powershell
dotnet run --project server/TwoKSixKPractice.Api/TwoKSixKPractice.Api.csproj
```

## Frontend

Run the Angular app from the `client` folder:

```powershell
cd client
npm install
npm start
```

The frontend calls `/api/...` and uses `client/proxy.conf.cjs` during `npm start` to forward API requests to the backend. If your backend is not on the default ASP.NET Core URL, set `API_BASE_URL` before `npm start`.

## Tests

From the repo root:

```powershell
.\scripts\test.ps1
```
