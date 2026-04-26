namespace TwoKSixKPractice.Api.Decks;

public sealed record RejectedDeckRow(
    int LineNumber,
    string OffendingValue,
    string ExpectedShape);
