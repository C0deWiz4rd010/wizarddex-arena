import { Chapter, ChapterAttributes } from '../models/chapter.model';

export function mapChapter(id: string, a: ChapterAttributes): Chapter {
  return {
    id,
    kind: 'chapter',
    slug: a.slug,
    name: a.title,
    image: null,
    wiki: null,
    order: a.order ?? null,
    summary: a.summary ?? null,
    raw: a,
  };
}
