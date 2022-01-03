import {
  STUDENT_STATUS_OPTIONS,
  getClosestTimeByN,
  isValidUrl,
  getUserDisplayStatus,
  classNames,
  sanitizePrivateProperties,
  cleanBadWords,
  cleanObjectOfBadWords,
  move,
} from '../index';

const STATUSES: { [key: string]: string } = STUDENT_STATUS_OPTIONS.reduce(
  (acc, curr) => ({
    ...acc,
    ...(Boolean(curr.value) ? { [curr.value]: curr.value } : {}),
  }),
  {},
);

const BAD_WORD = 'asshole';
const CLEANED_WORD = '*******';

describe('isValidUrl', () => {
  it('should be a valid url - https://wwww.google.com', () => {
    expect(isValidUrl('https://wwww.google.com')).toBe(true);
  });

  it('should be a valid url - https://google.com', () => {
    expect(isValidUrl('https://google.com')).toBe(true);
  });

  it('should be a valid url - http://wwww.google.com', () => {
    expect(isValidUrl('http://wwww.google.com')).toBe(true);
  });

  it('should be a valid url - http://google.com', () => {
    expect(isValidUrl('http://google.com')).toBe(true);
  });

  it('should be an invalid url - ssh://google.com', () => {
    expect(isValidUrl('ssh://google.com')).toBe(false);
  });

  it('should be an invalid url - www.google.com', () => {
    expect(isValidUrl('www.google.com')).toBe(false);
  });

  it('should be an invalid url - google.com', () => {
    expect(isValidUrl('google.com')).toBe(false);
  });

  it('should be an invalid url - google', () => {
    expect(isValidUrl('google')).toBe(false);
  });
});

describe('getUserDisplayStatus', () => {
  it('should equal correct Alumni display status', () => {
    expect(getUserDisplayStatus(STATUSES.ALUMNI)).toEqual('Alumni of ');
  });

  it('should equal correct Grad display status', () => {
    expect(getUserDisplayStatus(STATUSES.GRAD)).toEqual('Graduate Student at ');
  });

  it('should equal correct Freshman display status', () => {
    expect(getUserDisplayStatus(STATUSES.FRESHMAN)).toEqual('Freshman at ');
  });

  it('should equal correct Sophmore display status', () => {
    expect(getUserDisplayStatus(STATUSES.SOPHMORE)).toEqual('Sophmore at ');
  });

  it('should equal correct Junior display status', () => {
    expect(getUserDisplayStatus(STATUSES.JUNIOR)).toEqual('Junior at ');
  });

  it('should equal correct Senior display status', () => {
    expect(getUserDisplayStatus(STATUSES.SENIOR)).toEqual('Senior at ');
  });

  it('should equal correct Other display status', () => {
    expect(getUserDisplayStatus(STATUSES.OTHER)).toEqual('Other at ');
  });
});

describe('getClosestTimeByN', () => {
  it('should return correct time for 3, 8, 2', () => {
    expect(getClosestTimeByN(3, 8, 2)).toEqual('3:10');
  });

  it('should return correct time for 4, 1, 2', () => {
    expect(getClosestTimeByN(4, 1, 2)).toEqual('4:10');
  });

  it('should return correct time for 2, 34, 2', () => {
    expect(getClosestTimeByN(2, 34, 2)).toEqual('2:40');
  });

  it('should return correct time for 9, 60, 2', () => {
    expect(getClosestTimeByN(9, 60, 2)).toEqual('10:00');
  });
});

describe('classNames', () => {
  it('should return a string of classnames joined by spaces', () => {
    expect(classNames(['a', 'b', '', ' ', 'c ', ' d ', ' e'])).toEqual('a b c d e');
  });

  it('should return a empty string', () => {
    expect(classNames([])).toEqual('');
  });
});

describe('sanitizePrivateProperties', () => {
  it('should sanitize all private properties', () => {
    const withPrivateProperties = {
      _test: '_test',
      test: 'test',
      nested: {
        _nested: 123,
        a: { _b: '_b', x: null },
        _d: [],
      },
    };
    const withoutPrivateProperties = {
      test: 'test',
      nested: {
        a: { x: null },
      },
    };

    expect(sanitizePrivateProperties(withPrivateProperties)).toEqual(withoutPrivateProperties);
  });
});

describe('cleanBadWords', () => {
  it('should remove bad words', () => {
    expect(cleanBadWords(BAD_WORD)).toEqual(CLEANED_WORD);
  });
});

describe('cleanObjectOfBadWords', () => {
  it('should remove all bad words', () => {
    const withBadWords = {
      a: BAD_WORD,
      b: 'hello',
      c: {
        d: BAD_WORD,
        e: {
          f: BAD_WORD,
          g: 'test',
        },
      },
    };
    const withoutBadWords = {
      a: CLEANED_WORD,
      b: 'hello',
      c: {
        d: CLEANED_WORD,
        e: {
          f: CLEANED_WORD,
          g: 'test',
        },
      },
    };

    expect(cleanObjectOfBadWords(withBadWords)).toEqual(withoutBadWords);
  });
});

describe('move', () => {
  const BASE_ARR = ['a', 'b', 'c'];

  it('should return an array with items reordered a, b, c -> a, b, c', () => {
    expect(move(BASE_ARR, 0, 0)).toEqual(BASE_ARR);
  });

  it('should return an array with items reordered a, b, c -> b, a, c', () => {
    expect(move(BASE_ARR, 0, 1)).toEqual(['b', 'a', 'c']);
  });

  it('should return an array with items reordered a, b, c -> b, c, a', () => {
    expect(move(BASE_ARR, 0, 2)).toEqual(['b', 'c', 'a']);
  });

  it('should return an array with items reordered a, b, c -> b, a, c', () => {
    expect(move(BASE_ARR, 1, 0)).toEqual(['b', 'a', 'c']);
  });

  it('should return an array with items reordered a, b, c -> a, b, c', () => {
    expect(move(BASE_ARR, 1, 1)).toEqual(BASE_ARR);
  });

  it('should return an array with items reordered a, b, c -> a, c, b', () => {
    expect(move(BASE_ARR, 1, 2)).toEqual(['a', 'c', 'b']);
  });

  it('should return an array with items reordered a, b, c -> c, a, b', () => {
    expect(move(BASE_ARR, 2, 0)).toEqual(['c', 'a', 'b']);
  });

  it('should return an array with items reordered a, b, c -> a, c, b', () => {
    expect(move(BASE_ARR, 2, 1)).toEqual(['a', 'c', 'b']);
  });

  it('should return an array with items reordered a, b, c -> a, b, c', () => {
    expect(move(BASE_ARR, 2, 2)).toEqual(BASE_ARR);
  });
});
