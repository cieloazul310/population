import { calcPopulation } from '@cieloazul310/population-calculator';
import { CanvasMap } from '@cieloazul310/canvasmap';
import { program } from 'commander';
import { scaleSequential } from 'd3-scale';
import { interpolateSpectral } from 'd3-scale-chromatic'; 
import bbox from '@turf/bbox';
import { parseCenter, parseRadiuses, parseUnit, parseMode, parseUrl, unitToString, pointRadius } from './utils/helpers';

program.version('0.0.1');

program
  .option('-a, --area <geojson>', 'geojson file')
  .option('-c, --center <[x, y]>', 'center')
  .option('-r, --radiuses <radiuses>', 'radiuses')
  .option('-u, --unit <unit>', 'unit', 'kilometers')
  .option('-m, --mode <mode>', 'mode', 'mesh250')
  .option('-t, --title <title>', 'title')
  .option('--hard', 'enable to load many tiles')
  .option('--baseUrl <url>', 'base url');

program.parse(process.argv);

const center = parseCenter(program.center as string | null);
const radiuses = parseRadiuses(program.radiuses as string | null);
const unit = parseUnit(program.unit as string);
const mode = parseMode(program.mode as string);
const title = (program.title as string | null) ?? center.join(' ');
const hard = (program.hard as boolean | null) ?? false;
const baseUrl = parseUrl(program.baseUrl);

console.log(`center: ${center.join(', ')}`);
console.log(`radiuses: ${radiuses.join(', ')}`);
console.log(`unit: ${unit}`);
console.log(`mode: ${mode}`);
console.log(`baseUrl: ${baseUrl ?? ''}`);

const color = (val: number) =>
  (val > 100
    ? scaleSequential(interpolateSpectral).domain([800, 100])
    : scaleSequential(['#fff', interpolateSpectral(1)]).domain([0, 100]))(val);

calcPopulation(center, radiuses, 'mesh250', { unit, baseUrl, hard })
  .then((population) => {
    population.forEach(({ feature, points }) => {
      const val = points.reduce((accum, curr) => accum + curr.properties.val, 0);
      console.log(`${feature.properties.radius}: ${val}`);
    });
    const largest = population[population.length - 1];
    const { points, feature } = largest;
    const file = `../../dist/${title}.png`;

    return new CanvasMap(1600, 1600, feature, { title })
      .renderBasemap('vector')
      .then((map) => {
        const context = map.getContext();
        const { width } = map.getSize();
        const projection = map.getProjection();
        const path = map.getPath().pointRadius(pointRadius(projection.scale(), mode));
        
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
            const fontSize = map.getMapFontSize().attribution;

            context.font = `${fontSize}px sans-serif`;
            context.textAlign = 'right';
            context.textBaseline = 'bottom';
            context.fillStyle = '#c44';
            context.fillText(`${(feature.properties.radius)}${unitToString(unit)}`, width - 6, pos[1]);
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
