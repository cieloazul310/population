declare module '@mapbox/vector-tile' {
  import { Pbf } from 'pbf';
  import { Feature } from '@turf/helpers';

  class VectorTileFeature {
    type: number;
    extent: number;
    id: number;
    properties: unknown;
    //loadGeometry(): [][]number;
    //bbox(): [number, number, number, number];
    toGeoJSON<G, P = unknown>(x: number, y: number, z: number): Feature<G, P>;
  }
  class Layer {
    version: number;
    name: string;
    extent: number;
    length: number;
    feature(i: number): VectorTileFeature;
  }
  type Layers = {
    [key: string]: Layer;
  };
  declare class VectorTile {
    constructor(protobuf: Pbf);
    layers: Layers;
  }
}

declare module '@mapbox/tile-cover' {
  import { Geometry, GeometryCollection } from '@turf/helpers';
  import { Tile } from './types';
  export function tiles(
    geom: Geometry | GeometryCollection,
    limits: {
      max_zoom: number;
      min_zoom: number;
    }
  ): Tile[];
}
