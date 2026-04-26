# 2k/6k Practice Tool

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
