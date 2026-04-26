using TwoKSixKPractice.Api.Decks;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<AnkiDeckParser>();

WebApplication app = builder.Build();

app.MapGet("/", () => Results.Ok(new { name = "2k/6k Practice API" }));
app.MapPost("/api/decks/preview", DeckPreviewEndpoint.ReadPreviewAsync)
    .DisableAntiforgery();

app.Run();
