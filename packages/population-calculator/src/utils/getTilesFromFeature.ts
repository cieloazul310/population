import * as cover from '@mapbox/tile-cover';
import { Feature } from '@turf/helpers';
import { Tile } from '../types';

interface Options {
  min_zoom: number;
  max_zoom: number;
}

export function getTilesFromFeature(feature: Feature, options?: Partial<Options>): Tile[] {
  const opt: Options = {
    min_zoom: options?.min_zoom ?? 14,
    max_zoom: options?.max_zoom ?? 14,
  };
  if (!feature.geometry) throw new Error('Feature has no geometry');
  return cover.tiles(feature.geometry, {
    max_zoom: opt.max_zoom,
    min_zoom: opt.min_zoom,
  }) as Tile[];
}
