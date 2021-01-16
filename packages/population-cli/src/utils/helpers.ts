import { Units } from '@turf/helpers';
import { Mode } from 'population-calcurator/src/types';

export function parseCenter(str: string): number[] {
  const center = str.split(',').map((d) => parseFloat(d));
  
  if (center.length !== 2) throw new Error('Center error');
  if (Math.abs(center[0]) > 180) throw new Error('Center error');
  if (Math.abs(center[1]) > 90) throw new Error('Center error');
  
  return center;
}

export function parseRadiuses(str: string): number[] {
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