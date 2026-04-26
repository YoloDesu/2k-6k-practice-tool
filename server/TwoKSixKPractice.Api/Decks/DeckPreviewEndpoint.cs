using System.Text;

namespace TwoKSixKPractice.Api.Decks;

public static class DeckPreviewEndpoint
{
    /// <summary>
    /// Reads an uploaded Anki export and returns parsed preview cards.
    /// Example: POST a multipart file named "file" to /api/decks/preview.
    /// </summary>
    public static async Task<IResult> ReadPreviewAsync(IFormFile file, AnkiDeckParser parser)
    {
        if (file.Length == 0)
        {
            return Results.BadRequest("Uploaded file length was 0; expected a non-empty Anki .txt export.");
        }

        await using Stream stream = file.OpenReadStream();
        using StreamReader reader = new(stream, Encoding.UTF8, detectEncodingFromByteOrderMarks: true);
        string exportText = await reader.ReadToEndAsync();

        return Results.Ok(parser.Parse(exportText));
    }
}
