import { parseMVT } from '../parseMVT';
import { Point } from '@turf/helpers';
import { removeMultiple } from '../removeMultiple';
import { Mesh250Properties, Mesh500Properties, Tile } from '../../types';

const tiles: Tile[] = [
  [14583, 6412, 14],
  [14583, 6413, 14],
  [14584, 6412, 14],
  [14584, 6413, 14],
];

describe('parseMVT: local tiles', () => {
  it('250mesh', () => {
    return parseMVT<Point, Mesh250Properties>(
      '/Users/cieloazul310/Documents/github/binarytiles/docs/tile/population_250m/{z}/{x}/{y}.mvt',
      [14582, 6414, 14],
      '250mesh'
    ).then((features) => {
      expect(features.reduce((accum, curr) => accum + (curr.properties?.val ?? 0), 0)).toBe(1062);
    });
  });

  it('500mesh', () => {
    return parseMVT<Point, Mesh500Properties>(
      '/Users/cieloazul310/Documents/github/binarytiles/docs/tile/population_500m/{z}/{x}/{y}.mvt',
      [14582, 6414, 14],
      'merged'
    ).then((features) => {
      expect(features.reduce((accum, curr) => accum + (curr.properties?.val_2005 ?? 0), 0)).toBe(649);
      expect(features.reduce((accum, curr) => accum + (curr.properties?.val_2010 ?? 0), 0)).toBe(643);
      expect(features.reduce((accum, curr) => accum + (curr.properties?.val_2015 ?? 0), 0)).toBe(702);
    });
  });

  it('Promise.all', () => {
    return Promise.all(
      tiles.map((tile) =>
        parseMVT<Point, Mesh250Properties>(
          '/Users/cieloazul310/Documents/github/binarytiles/docs/tile/population_250m/{z}/{x}/{y}.mvt',
          tile,
          '250mesh'
        )
      )
    )
      .then((mvtTiles) => mvtTiles.reduce((accum, curr) => [...accum, ...curr], []))
      .then((features) => removeMultiple(features, (feature) => feature.properties?.id ?? 0))
      .then((features) => {
        const val = features.reduce((accum, curr) => accum + curr.properties?.val ?? 0, 0);
        expect(features.length).toBeGreaterThan(0);
        expect(val).toBe(59627);
      });
  });
});
