import { Units } from '@turf/helpers';
import { Mode } from 'population-calculator/src/types';
import { scaleToZoom, zoomToScale } from 'canvasmap/src/utils/zoomToScale';

export function parseCenter(str: string | null): number[] {
  if (!str) throw new Error('Center Position not found!');
  const center = str.split(',').map((d) => parseFloat(d));
  
  if (center.length !== 2) throw new Error('Center error');
  if (Math.abs(center[0]) > 180) throw new Error('Center error');
  if (Math.abs(center[1]) > 90) throw new Error('Center error');
  
  return center;
}

export function parseRadiuses(str: string | null): number[] {
  if (!str) throw new Error('Radiuses not found!');
  const radiuses = str.split(',').map((d) => parseFloat(d));
  
  if (!radiuses.length) throw new Error('Radiuses error');

  return [...radiuses].sort((a, b) => a - b);
}

export function parseUnit(str: string): Units {
  function isUnit(str: string): str is Units {
    return str === 'degrees' || str === 'inches' || str === 'kilometers' || str === 'kilometres' || str === 'meters' || str === 'metres' || str === 'miles' || str === 'naticalmiles' || str === 'radians' || str === 'yards';
  }
  
  if (!isUnit(str)) throw new Error('Unit erorr');
  return str;
}

export function parseMode(str: string): Mode {
  function isMode(str: string): str is Mode {
    return str === 'mesh250' || str === 'mesh500';
  }
  if (!isMode(str)) throw new Error('Mode error');
  return str;
}

export function parseUrl(str: string | undefined): string | undefined {
  if (typeof str === 'undefined') return undefined;

  const hoge = str.split('{z}/{x}/{y}');
  if (hoge.length !== 2) throw new Error('baseUrl must contain {z}/{x}/{y}');
  return str;
}

export function unitToString(unit: Units): string {
  if (unit === 'kilometers') return 'km';
  if (unit === 'meters') return 'm';
  return unit;
}

export function pointRadius(scale: number, mode: Mode): number {
  const zoom = scaleToZoom(scale);
  const defaultSize = 4.5;
  const threshold = mode === 'mesh250' ? [12, 13] : [11, 12];
  return zoom > threshold[1]
    ? Math.min(defaultSize * (scale / zoomToScale(threshold[1])), 12)
    : zoom < threshold[0]
    ? Math.max(defaultSize * (scale / zoomToScale(threshold[0])), 2)
    : defaultSize;
}
