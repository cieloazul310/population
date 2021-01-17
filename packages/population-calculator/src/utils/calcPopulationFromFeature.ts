import { getTilesFromFeature } from './getTilesFromFeature';
import { getPopulationTiles } from './getPopulationTiles';
import pointsWithinPolygon from '@turf/points-within-polygon';
import { meshPoints } from './helpers';
import { Feature, Polygon } from '@turf/helpers';
import { Mode, Stat } from '../types';

interface CalcPopulationFromFeatureOptions {
  baseUrl?: string;
  hard: boolean;
}

export async function calcPopulationFromFeature<T extends Mode>(
  feature: Feature<Polygon>,
  mode: T,
  options?: Partial<CalcPopulationFromFeatureOptions>
): Promise<Stat<T>> {
  const tiles = getTilesFromFeature(feature, { min_zoom: 14, max_zoom: 14 }) ?? [];
  if (tiles.length === 0) throw new Error('There are no tiles');
  if (!options?.hard && tiles.length > 200) throw new Error('Too many tiles');

  try {
    const points = await getPopulationTiles(tiles, mode, { baseUrl: options?.baseUrl });
    return {
      points: meshPoints(pointsWithinPolygon(points, feature).features, mode),
      feature,
    };
  } catch (err) {
    throw new Error(err);
  }
}
