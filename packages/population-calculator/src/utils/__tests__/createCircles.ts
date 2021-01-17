import { createCircles } from '../createCircles';
import area from '@turf/area';

const center = [140.4126, 36.3453];
const radiuses = [1, 3, 5];

describe('createCircles', () => {
  it('simple', () => {
    const circles = createCircles(center, radiuses);
    expect(circles.length).toBe(3);
    expect(circles[0].geometry.type === 'Polygon');
    expect(circles[0].properties.unit).toBe('kilometers');
    expect(circles[0].properties.center).toStrictEqual(center);
  });
});

describe('createCircles', () => {
  it('change unit', () => {
    const circles = createCircles(
      center,
      radiuses.map((r) => r * 1000),
      { unit: 'meters' }
    );
    expect(circles.length).toBe(3);
    expect(circles[0].geometry.type === 'Polygon');
    expect(circles[0].properties.unit).toBe('meters');
    expect(circles[0].properties.center).toStrictEqual(center);
  });
  it('different unit', () => {
    const [a] = createCircles(center, [1]);
    const [b] = createCircles(center, [1000], { unit: 'meters' });
    expect(area(a)).toBe(area(b));
  });
});
