import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DeckPreview } from '../models/deck-card';

@Injectable({ providedIn: 'root' })
export class DeckPreviewApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly previewUrl = '/api/decks/preview';

  /**
   * Uploads an Anki export and returns parsed preview rows.
   * Example: deckPreviewApi.previewDeck(file).subscribe(...).
   */
  previewDeck(file: File): Observable<DeckPreview> {
    const form = new FormData();
    form.append('file', file, file.name);

    return this.httpClient.post<DeckPreview>(this.previewUrl, form);
  }
}
