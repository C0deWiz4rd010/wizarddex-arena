import { BaseResource } from './base.model';

export interface MovieAttributes {
  box_office?: string | null;
  budget?: string | null;
  cinematographers?: string[] | null;
  directors?: string[] | null;
  distributors?: string[] | null;
  editors?: string[] | null;
  music_composers?: string[] | null;
  poster?: string | null;
  /** Defensive: some payloads may expose an `image` instead of `poster`. */
  image?: string | null;
  producers?: string[] | null;
  rating?: string | null;
  release_date?: string | null;
  running_time?: string | null;
  screenwriters?: string[] | null;
  slug: string;
  summary?: string | null;
  title: string;
  trailer?: string | null;
  wiki?: string | null;
}

export interface Movie extends BaseResource {
  kind: 'movie';
  boxOffice?: string | null;
  budget?: string | null;
  cinematographers: string[];
  directors: string[];
  distributors: string[];
  editors: string[];
  musicComposers: string[];
  poster?: string | null;
  producers: string[];
  rating?: string | null;
  releaseDate?: string | null;
  runningTime?: string | null;
  screenwriters: string[];
  summary?: string | null;
  trailer?: string | null;
  raw: MovieAttributes;
}
