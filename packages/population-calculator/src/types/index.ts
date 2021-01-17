import { Units, Position, Feature, Polygon, Point, Properties } from '@turf/helpers';

/**
 * population mode 'mesh250' or 'mesh500'
 * 'mesh250' is based on 250m mesh and the points have a properties like { id: KEY_CODE, val: 2015 population }.
 * 'mesh500' is based on 500m mesh and the points have a properties like { KEY_CODE, val_2005, val_2010, val_2015 }
 */
export type Mode = 'mesh250' | 'mesh500';
export type ObjectType<T> = T extends 'mesh250' ? Mesh250 : T extends 'mesh500' ? Mesh500 : never;
export type ObjectPropertiesType<T> = T extends 'mesh250' ? Mesh250Properties : T extends 'mesh500' ? Mesh500Properties : never;

/**
 * Tile Coord like [x, y, z]
 */
export type Tile = [number, number, number];

/**
 * Stat Object has a feature and an array of population point features within the feature
 */
export type Stat<T extends Mode, P = Properties> = {
  feature: Feature<Polygon, P>;
  points: ObjectType<T>[];
};

export interface CircleProperties {
  center: Position;
  radius: number;
  unit: Units;
}

export interface Mesh250Properties {
  id: string;
  val: number;
}

export interface Mesh500Properties {
  KEY_CODE: string;
  val_2005: number;
  val_2010: number;
  val_2015: number;
}

export type Mesh250 = Feature<Point, Mesh250Properties>;
export type Mesh500 = Feature<Point, Mesh500Properties>;
export type Mesh = Mesh250 | Mesh500;
