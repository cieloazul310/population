import { Feature, Point } from '@turf/helpers';
import { Mode, Mesh250, Mesh500, ObjectType } from '../types';

export function isMesh250Points(points: Feature<Point>[]): points is Mesh250[] {
  return points.every(({ properties }) => properties && 'id' in properties && 'val' in properties);
}

export function isMesh500Points(points: Feature<Point>[]): points is Mesh500[] {
  return points.every(({ properties }) => properties && 'KEY_CODE' in properties);
}

export function isMesh<T extends Mode>(points: Feature<Point>[], mode: T): points is ObjectType<T>[] {
  return mode === 'mesh250' ? isMesh250Points(points) : mode === 'mesh500' ? isMesh500Points(points) : false;
}

export function meshPoints<T extends Mode>(points: Feature<Point>[], mode: T): ObjectType<T>[] {
  if (isMesh(points, mode)) return points;
  return [];
}
