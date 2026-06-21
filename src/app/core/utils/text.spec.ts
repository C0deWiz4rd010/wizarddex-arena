import { describe, expect, it } from 'vitest';

import { ensureArray, parseTextList, valueOr } from './text';

describe('text utils', () => {
  describe('ensureArray', () => {
    it('returns an empty array for null/undefined', () => {
      expect(ensureArray(null)).toEqual([]);
      expect(ensureArray(undefined)).toEqual([]);
    });

    it('trims and drops empty entries', () => {
      expect(ensureArray([' a ', '', 'b'])).toEqual(['a', 'b']);
    });
  });

  describe('parseTextList', () => {
    it('splits on commas, semicolons and "and"', () => {
      expect(parseTextList('eye of newt, toe of frog and bat spleen')).toEqual([
        'eye of newt',
        'toe of frog',
        'bat spleen',
      ]);
    });

    it('returns an empty array for blank input', () => {
      expect(parseTextList('')).toEqual([]);
      expect(parseTextList(null)).toEqual([]);
    });
  });

  describe('valueOr', () => {
    it('returns the trimmed value when present', () => {
      expect(valueOr('  Gryffindor ')).toBe('Gryffindor');
    });

    it('falls back when empty', () => {
      expect(valueOr('')).toBe('Unknown');
      expect(valueOr(null, 'N/A')).toBe('N/A');
    });
  });
});
