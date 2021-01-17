import { calcPopulation } from '../calcPopulation';

const center = [140.4126, 36.3453];
const radiuses = [1, 3, 5];

describe('calcPopulation', () => {
  it('check always same value', () => {
    return calcPopulation(center, radiuses, 'mesh250').then(([a, b, c]) => {
      expect(a.points.reduce((accum, curr) => accum + (curr.properties?.val ?? 0), 0)).toBe(634);
      expect(b.points.reduce((accum, curr) => accum + (curr.properties?.val ?? 0), 0)).toBe(26337);
      expect(c.points.reduce((accum, curr) => accum + (curr.properties?.val ?? 0), 0)).toBe(117842);
    });
  });
});

describe('use local tiles', () => {
  it('check always same value', () => {
    return calcPopulation(center, radiuses, 'mesh250', {
      baseUrl: '/Users/cieloazul310/Documents/github/binarytiles/docs/tile/population_250m/{z}/{x}/{y}.mvt',
    }).then(([a, b, c]) => {
      expect(a.points.reduce((accum, curr) => accum + (curr.properties?.val ?? 0), 0)).toBe(634);
      expect(b.points.reduce((accum, curr) => accum + (curr.properties?.val ?? 0), 0)).toBe(26337);
      expect(c.points.reduce((accum, curr) => accum + (curr.properties?.val ?? 0), 0)).toBe(117842);
    });
  });
});
