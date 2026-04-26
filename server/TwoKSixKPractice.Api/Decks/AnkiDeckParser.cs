using System.Text.RegularExpressions;

namespace TwoKSixKPractice.Api.Decks;

public sealed partial class AnkiDeckParser
{
    private const string ExpectedRowShape =
        "expression + 3 spaces + example, tab, translation + reading + type + furigana + translated sentence separated by 3 spaces";

    /// <summary>
    /// Parses a UTF-8 Anki text export into practice cards.
    /// Example: parser.Parse(exportText).Cards[0].ReadingHiragana returns the answer key.
    /// </summary>
    public DeckPreview Parse(string exportText)
    {
        string[] rows = exportText.Split(["\r\n", "\n"], StringSplitOptions.None);
        List<DeckCard> cards = [];
        List<RejectedDeckRow> rejectedRows = [];

        for (int rowIndex = 0; rowIndex < rows.Length; rowIndex++)
        {
            ParseRow(rows[rowIndex], rowIndex + 1, cards, rejectedRows);
        }

        return new DeckPreview(cards, rejectedRows);
    }

    private static void ParseRow(
        string row,
        int lineNumber,
        List<DeckCard> cards,
        List<RejectedDeckRow> rejectedRows)
    {
        if (ShouldSkipRow(row))
        {
            return;
        }

        DeckCard? card = TryCreateCard(row, cards.Count + 1);
        if (card is not null)
        {
            cards.Add(card);
            return;
        }

        rejectedRows.Add(new RejectedDeckRow(lineNumber, row, ExpectedRowShape));
    }

    private static bool ShouldSkipRow(string row)
    {
        if (string.IsNullOrWhiteSpace(row))
        {
            return true;
        }

        return row.StartsWith('#') || row.StartsWith("WORD/KANJI", StringComparison.Ordinal);
    }

    private static DeckCard? TryCreateCard(string row, int id)
    {
        string[] tabParts = row.Split('\t', 2);
        if (tabParts.Length != 2)
        {
            return null;
        }

        string[] leftParts = SpaceRunPattern().Split(tabParts[0].Trim());
        string[] rightParts = SpaceRunPattern().Split(tabParts[1].Trim());
        if (leftParts.Length != 2 || rightParts.Length != 5)
        {
            return null;
        }

        return CreateCard(id, leftParts, rightParts);
    }

    private static DeckCard CreateCard(int id, string[] leftParts, string[] rightParts)
    {
        string expression = leftParts[0].Trim();
        return new DeckCard(
            id,
            expression,
            leftParts[1].Trim(),
            rightParts[0].Trim(),
            rightParts[1].Trim(),
            rightParts[2].Trim(),
            rightParts[3].Trim(),
            rightParts[4].Trim(),
            ContainsKanji(expression));
    }

    private static bool ContainsKanji(string value)
    {
        foreach (char character in value)
        {
            if (character is >= '\u4E00' and <= '\u9FFF')
            {
                return true;
            }
        }

        return false;
    }

    [GeneratedRegex(" {3,}")]
    private static partial Regex SpaceRunPattern();
}
