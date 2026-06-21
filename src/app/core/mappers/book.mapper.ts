import { Book, BookAttributes } from '../models/book.model';
import { imageOrPlaceholder } from '../utils/image-fallback';

export function mapBook(id: string, a: BookAttributes): Book {
  return {
    id,
    kind: 'book',
    slug: a.slug,
    name: a.title,
    image: imageOrPlaceholder(a.cover, 'book', a.slug || a.title),
    wiki: a.wiki ?? null,
    author: a.author ?? null,
    cover: a.cover ?? null,
    dedication: a.dedication ?? null,
    pages: a.pages ?? null,
    releaseDate: a.release_date ?? null,
    summary: a.summary ?? null,
    raw: a,
  };
}
