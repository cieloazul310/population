import { calcPopulation } from 'population-calculator';
import { CanvasMap } from 'canvasmap';
import { program } from 'commander';
import { scaleSequential } from 'd3-scale';
import { interpolateSpectral } from 'd3-scale-chromatic'; 
import bbox from '@turf/bbox';
import { parseCenter, parseRadiuses, parseUnit, parseMode, parseUrl } from './utils/helpers';

program.version('0.0.1');

program
  .option('-a, --area <geojson>', 'geojson file')
  .option('-c, --center <[x, y]>', 'center')
  .option('-r, --radiuses <radiuses>', 'radiuses')
  .option('-u, --unit <unit>', 'unit', 'kilometers')
  .option('-m, --mode <mode>', 'mode', 'mesh250')
  .option('--baseUrl <url>', 'base url');

program.parse(process.argv);

const center = parseCenter(program.center as string);
const radiuses = parseRadiuses(program.radiuses as string);
const unit = parseUnit(program.unit as string);
const mode = parseMode(program.mode as string);
const baseUrl = parseUrl(program.baseUrl);

console.log(center);
console.log(radiuses);
console.log(unit);
console.log(mode);
console.log(baseUrl);

const color = (val: number) =>
  (val > 100
    ? scaleSequential(interpolateSpectral).domain([800, 100])
    : scaleSequential(['#fff', interpolateSpectral(1)]).domain([0, 100]))(val);

calcPopulation(center, radiuses, 'mesh250', { unit, baseUrl })
  .then((population) => {
    const largest = population[population.length - 1];
    const { points, feature } = largest;
    const file = `../../dist/hoge.png`;

    return new CanvasMap(1600, 1600, feature, { title: center.join(' ') })
      .renderBasemap('vector')
      .then((map) => {
        const context = map.getContext();
        const { width } = map.getSize();
        const projection = map.getProjection();
        const path = map.getPath();
        
        points.forEach((point) => {
          context.beginPath();
          path(point);
          context.fillStyle = color(point.properties?.val ?? 0);
          context.globalCompositeOperation = 'multiply';
          context.fill();
          context.globalCompositeOperation = 'source-over';
        });

        population.forEach(({ feature }) => {
          context.beginPath();
          path(feature);
          context.strokeStyle = '#c77';
          context.lineWidth = 2;
          context.globalCompositeOperation = 'multiply';
          context.stroke();
          context.globalCompositeOperation = 'source-over';

          if (feature.properties?.radius) {
            const [minX, minY] = bbox(feature);
            const pos = projection([minX, minY]) ?? [0, 0];
            const fontSize = map.getMapFontSize().large;

            context.font = `${fontSize}px sans-serif`;
            context.textAlign = 'right';
            context.textBaseline = 'bottom';
            context.fillStyle = '#c44';
            context.fillText(`${(feature.properties?.radius as number)}km`, width - 6, pos[1]);
          }
        });

        map.addAttribution('地域メッシュ統計');
        map.exportPng(file);
      })
      .catch((err) => console.error(err));
  })
  .catch((err) => {
    console.error(err);
  });
