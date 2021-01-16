import { calcPopulationFromFeature } from '../calcPopulationFromFeature';
import circle from '@turf/circle';

const center = [140.4126, 36.3453];
const radius = 5;

describe('calcPopulationFromFeature', () => {
  it('with circle', () => {
    const feature = circle(center, radius);
    return calcPopulationFromFeature(feature, 'mesh250')
      .then(({ points }) => {
        expect(points.reduce((accum, curr) => accum + (curr.properties?.val ?? 0), 0)).toBe(117842);
      });
  });

  it('use local tiles', () => {
    const feature = circle(center, radius);
    return calcPopulationFromFeature(feature, 'mesh250', {
      baseUrl: '/Users/cieloazul310/Documents/github/binarytiles/docs/tile/population_250m/{z}/{x}/{y}.mvt',
    }).then(({ points }) => {
      expect(points.reduce((accum, curr) => accum + (curr.properties?.val ?? 0), 0)).toBe(117842);
    });
  });
});
