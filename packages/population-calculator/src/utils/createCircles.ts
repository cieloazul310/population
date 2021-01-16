import { Feature, Polygon, Position } from '@turf/helpers';
import circle from '@turf/circle';
import rewind from '@turf/rewind';
import { CircleProperties } from '../types';
import { Units } from '@turf/helpers';

interface Options {
  unit: Units;
}

export function createCircles(center: Position, radiuses: number[], options?: Partial<Options>): Feature<Polygon, CircleProperties>[] {
  const units = options?.unit ?? 'kilometers';
  return radiuses.sort((a, b) => a - b).map((radius) => rewind(circle(center, radius, { units, properties: { center, radius, unit: units } }), { reverse: true }));
}
