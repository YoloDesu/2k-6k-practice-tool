namespace TwoKSixKPractice.Api.Decks;

public sealed record DeckCard(
    int Id,
    string Expression,
    string ExampleSentence,
    string Translation,
    string ReadingHiragana,
    string PartOfSpeech,
    string FuriganaSentence,
    string TranslatedSentence,
    bool HasKanji);
