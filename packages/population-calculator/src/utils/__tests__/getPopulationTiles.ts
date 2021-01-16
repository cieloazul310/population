import { getPopulationTiles } from '../getPopulationTiles';
import { Tile } from '../../types';

const mesh250 = '/Users/cieloazul310/Documents/github/binarytiles/docs/tile/population_250m/{z}/{x}/{y}.mvt';
const mesh500 = '/Users/cieloazul310/Documents/github/binarytiles/docs/tile/population_500m/{z}/{x}/{y}.mvt';

const tiles: Tile[] = [
  [14583, 6412, 14],
  [14583, 6413, 14],
  [14584, 6412, 14],
  [14584, 6413, 14],
];

describe('remote tiles', () => {
  it('mesh250', () => {
    return getPopulationTiles(tiles, 'mesh250').then((points) => {
      const val = points.features.reduce((accum, curr) => accum + curr.properties.val ?? 0, 0);
      expect(val).toBe(59627);
    });
  });
  it('mesh500', () => {
    return getPopulationTiles(tiles, 'mesh500').then((points) => {
      const val2015 = points.features.reduce((accum, curr) => accum + curr.properties.val_2015 ?? 0, 0);
      expect(val2015).toBe(61949);
    });
  });
});

describe('local tiles', () => {
  it('mesh250', () => {
    return getPopulationTiles(tiles, 'mesh250', { baseUrl: mesh250 }).then((points) => {
      const val = points.features.reduce((accum, curr) => accum + curr.properties.val ?? 0, 0);
      expect(val).toBe(59627);
    });
  });

  it('mesh500', () => {
    return getPopulationTiles(tiles, 'mesh500', { baseUrl: mesh500 }).then((points) => {
      const val_2015 = points.features.reduce((accum, curr) => accum + curr.properties.val_2015 ?? 0, 0);
      expect(val_2015).toBe(61949);
    });
  });
});
