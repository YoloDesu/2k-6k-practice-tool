using TwoKSixKPractice.Api.Decks;

TestCase[] tests =
[
    new("Parses provided export shape", DeckParserTests.ParsesProvidedExportShape),
    new("Skips metadata and header rows", DeckParserTests.SkipsMetadataAndHeaderRows),
    new("Reports malformed rows", DeckParserTests.ReportsMalformedRows),
    new("Detects kanji expressions", DeckParserTests.DetectsKanjiExpressions),
];

int failedCount = 0;
foreach (TestCase test in tests)
{
    failedCount += RunTest(test);
}

Environment.ExitCode = failedCount;

static int RunTest(TestCase test)
{
    try
    {
        test.Execute();
        Console.WriteLine($"PASS {test.Name}");
        return 0;
    }
    catch (Exception exception)
    {
        Console.WriteLine($"FAIL {test.Name}: {exception.Message}");
        return 1;
    }
}

internal sealed record TestCase(string Name, Action Execute);

internal static class DeckParserTests
{
    public static void ParsesProvidedExportShape()
    {
        DeckPreview preview = Parse(SampleExport());
        DeckCard firstCard = preview.Cards[0];

        TestAssert.Equal(2, preview.Cards.Count, "card count");
        TestAssert.Equal("一つ", firstCard.Expression, "expression");
        TestAssert.Equal("ひとつ", firstCard.ReadingHiragana, "reading");
        TestAssert.Equal("Please give me one of those.", firstCard.TranslatedSentence, "translation");
    }

    public static void SkipsMetadataAndHeaderRows()
    {
        DeckPreview preview = Parse(SampleExport());

        TestAssert.Empty(preview.RejectedRows, "rejected rows");
        TestAssert.Equal("一つ", preview.Cards[0].Expression, "first expression");
    }

    public static void ReportsMalformedRows()
    {
        DeckPreview preview = Parse("#separator:tab\nbad row");

        TestAssert.Empty(preview.Cards, "cards");
        TestAssert.Equal(1, preview.RejectedRows.Count, "rejected rows");
        TestAssert.Equal(2, preview.RejectedRows[0].LineNumber, "line number");
    }

    public static void DetectsKanjiExpressions()
    {
        DeckPreview preview = Parse(SampleExport());

        TestAssert.True(preview.Cards[0].HasKanji, "kanji card");
        TestAssert.False(preview.Cards[1].HasKanji, "kana card");
    }

    private static DeckPreview Parse(string exportText)
    {
        AnkiDeckParser parser = new();
        return parser.Parse(exportText);
    }

    private static string SampleExport()
    {
        return string.Join('\n',
            "#separator:tab",
            "#html:false",
            "WORD/KANJI - PHRASE WHERE THE WORD IS USED - TRANSLATION - HIRAGANA VERSION - TYPE (EXCLUDE) - PHRASE AGAIN WITH FURIGANA - PHRASE TRANSLATED",
            "一つ   それを一つください。\tone (thing)   ひとつ   Noun   それを一ひとつください。   Please give me one of those.",
            "これ   これをください。\tthis, this one   これ   Noun   これをください。   I'll have this please.");
    }
}

internal static class TestAssert
{
    public static void Empty<TValue>(IReadOnlyCollection<TValue> values, string name)
    {
        if (values.Count == 0)
        {
            return;
        }

        throw new InvalidOperationException($"{name} was {values.Count}; expected 0.");
    }

    public static void Equal<TValue>(TValue expected, TValue actual, string name)
    {
        if (EqualityComparer<TValue>.Default.Equals(expected, actual))
        {
            return;
        }

        throw new InvalidOperationException($"{name} was {actual}; expected {expected}.");
    }

    public static void False(bool actual, string name)
    {
        if (!actual)
        {
            return;
        }

        throw new InvalidOperationException($"{name} was true; expected false.");
    }

    public static void True(bool actual, string name)
    {
        if (actual)
        {
            return;
        }

        throw new InvalidOperationException($"{name} was false; expected true.");
    }
}
