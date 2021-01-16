import { parseMVT } from './parseMVT';
import { removeMultiple } from './removeMultiple';
import { featureCollection, FeatureCollection, Point } from '@turf/helpers';
import { Tile, Mode, ObjectPropertiesType, Mesh250Properties, Mesh500Properties } from '../types';

interface Options {
  baseUrl: string;
}

export async function getPopulationTiles<T extends Mode>(
  tiles: Tile[],
  mode: T,
  options?: Partial<Options>
): Promise<FeatureCollection<Point, ObjectPropertiesType<T>>> {
  const opt: Options = {
    baseUrl:
      options?.baseUrl ??
      (mode === 'mesh500'
        ? 'https://cieloazul310.github.io/mvt-tiles/tile/population_500m/{z}/{x}/{y}.mvt'
        : 'https://cieloazul310.github.io/mvt-tiles/tile/population_250m/{z}/{x}/{y}.mvt'),
  };
  const layerName = mode === 'mesh500' ? 'merged' : '250mesh';

  try {
    const points = await Promise.all(tiles.map((tile) => parseMVT<Point, ObjectPropertiesType<T>>(opt.baseUrl, tile, layerName)))
      .then((allTiles) => allTiles.reduce((accum, curr) => [...accum, ...curr], []))
      .then((features) =>
        removeMultiple(features, (feature) => {
          return mode == 'mesh500' ? (feature.properties as Mesh500Properties).KEY_CODE : (feature.properties as Mesh250Properties).id;
        })
      )
      .then((features) => featureCollection(features));

    if (points.features.length === 0) throw new Error('There are no point features');

    return points;
  } catch (err) {
    throw new Error(err);
  }
}
