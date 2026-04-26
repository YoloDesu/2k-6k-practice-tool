namespace TwoKSixKPractice.Api.Decks;

public sealed record DeckPreview(
    IReadOnlyList<DeckCard> Cards,
    IReadOnlyList<RejectedDeckRow> RejectedRows);
