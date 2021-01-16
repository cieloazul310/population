import * as fs from 'fs';
import * as path from 'path';
import nodeFetch from 'node-fetch';
import * as url from 'url';
import Pbf from 'pbf';
import { VectorTile } from '@mapbox/vector-tile';
import { Feature } from '@turf/helpers';
import { Tile } from '../types';

export function parseMVT<G, P>(baseUrl: string, tile: Tile, layerName: string): Promise<Feature<G, P>[]> {
  const reqUrl = baseUrl.replace('{z}/{x}/{y}', `${tile[2]}/${tile[0]}/${tile[1]}`);
  const parsed = url.parse(reqUrl);

  if (parsed.protocol && (parsed.protocol === 'http:' || parsed.protocol === 'https:')) {
    return nodeFetch(reqUrl)
      .then((res) => res.arrayBuffer())
      .then((buffer) => new Pbf(buffer))
      .then((pbf) => {
        const layer = new VectorTile(pbf).layers[layerName];
        const features: Feature<G, P>[] = [];
        if (layer) {
          for (let i = 0; i < layer.length; i++) {
            const feature = layer.feature(i);
            features.push(feature.toGeoJSON(tile[0], tile[1], tile[2]));
          }
        }
        return features;
      })
      .catch(() => []);
  } else {
    return fs.promises
      .readFile(path.resolve(reqUrl))
      .then((buffer) => {
        const pbf = new Pbf(buffer);
        const layer = new VectorTile(pbf).layers[layerName];
        const features: Feature<G, P>[] = [];
        if (layer) {
          for (let i = 0; i < layer.length; i++) {
            const feature = layer.feature(i).toGeoJSON<G, P>(tile[0], tile[1], tile[2]);
            features.push(feature);
          }
        }
        return features;
      })
      .catch(() => []);
  }
}
