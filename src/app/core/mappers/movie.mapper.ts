import { Movie, MovieAttributes } from '../models/movie.model';
import { imageOrPlaceholder } from '../utils/image-fallback';
import { ensureArray } from '../utils/text';

export function mapMovie(id: string, a: MovieAttributes): Movie {
  // Defensive: prefer `poster`, fall back to `image`-like field if present.
  const poster = a.poster ?? a.image ?? null;
  return {
    id,
    kind: 'movie',
    slug: a.slug,
    name: a.title,
    image: imageOrPlaceholder(poster, 'movie', a.slug || a.title),
    wiki: a.wiki ?? null,
    boxOffice: a.box_office ?? null,
    budget: a.budget ?? null,
    cinematographers: ensureArray(a.cinematographers),
    directors: ensureArray(a.directors),
    distributors: ensureArray(a.distributors),
    editors: ensureArray(a.editors),
    musicComposers: ensureArray(a.music_composers),
    poster,
    producers: ensureArray(a.producers),
    rating: a.rating ?? null,
    releaseDate: a.release_date ?? null,
    runningTime: a.running_time ?? null,
    screenwriters: ensureArray(a.screenwriters),
    summary: a.summary ?? null,
    trailer: a.trailer ?? null,
    raw: a,
  };
}
