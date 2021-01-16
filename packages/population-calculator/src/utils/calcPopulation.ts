import { createCircles } from './createCircles';
import { getTilesFromFeature } from './getTilesFromFeature';
import { getPopulationTiles } from './getPopulationTiles';
import { meshPoints } from './helpers';
import pointsWithinPolygon from '@turf/points-within-polygon';
import { Position, Units } from '@turf/helpers';
import { Stat, Mode, CircleProperties } from '../types';

export interface CalcPopulationOptions {
  /**
   * turf.js units
   */
  unit: Units;
  /**
   * population tile url
   * enable to set local tiles
   */
  baseUrl?: string;
  /**
   * enable to load many tiles
   */
  hard: boolean;
}

/**
 * 
 * @param {Array} center a coordinate of center 
 * @param {Array} radiuses array of radiuses
 * @param {String} mode 'mesh250' or 'mesh500'
 * @param options optional
 * @returns {Promise<Stat[]>} feature object and an array of points within the feature
 */
export async function calcPopulation<T extends Mode>(
  center: Position,
  radiuses: number[],
  mode: T,
  options?: Partial<CalcPopulationOptions>
): Promise<Stat<T, CircleProperties>[]> {
  const circles = createCircles(center, radiuses, { unit: options?.unit });
  const largest = circles[circles.length - 1];
  const tiles = getTilesFromFeature(largest, { min_zoom: 14, max_zoom: 14 }) ?? [];
  if (tiles.length === 0) throw new Error('There are no tiles');
  if (!options?.hard && tiles.length > 200) throw new Error('Too many tiles');

  try {
    const points = await getPopulationTiles(tiles, mode, { baseUrl: options?.baseUrl });

    return circles.map((circle) => {
      return {
        points: meshPoints(pointsWithinPolygon(points, circle).features, mode),
        feature: circle,
      };
    });
  } catch (err) {
    throw new Error(err);
  }
}
