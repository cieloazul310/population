[population-calculator](README.md) / Exports

# population-calculator

## Table of contents

### Functions

- [calcPopulation](modules.md#calcpopulation)
- [calcPopulationFromFeature](modules.md#calcpopulationfromfeature)

## Functions

### calcPopulation

▸ **calcPopulation**<T\>(`center`: Position, `radiuses`: *number*[], `mode`: T, `options?`: *Partial*<CalcPopulationOptions\>): *Promise*<*Stat*<T, CircleProperties\>[]\>

#### Type parameters:

Name | Type |
------ | ------ |
`T` | Mode |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`center` | Position | a coordinate of center   |
`radiuses` | *number*[] | array of radiuses   |
`mode` | T | 'mesh250' or 'mesh500'   |
`options?` | *Partial*<CalcPopulationOptions\> | optional   |

**Returns:** *Promise*<*Stat*<T, CircleProperties\>[]\>

feature object and an array of points within the feature

Defined in: [calcPopulation.ts:33](https://github.com/cieloazul310/population/blob/902d785/packages/population-calculator/src/utils/calcPopulation.ts#L33)

___

### calcPopulationFromFeature

▸ **calcPopulationFromFeature**<T\>(`feature`: *Feature*<Polygon\>, `mode`: T, `options?`: *Partial*<Options\>): *Promise*<*Stat*<T\>\>

#### Type parameters:

Name | Type |
------ | ------ |
`T` | Mode |

#### Parameters:

Name | Type |
------ | ------ |
`feature` | *Feature*<Polygon\> |
`mode` | T |
`options?` | *Partial*<Options\> |

**Returns:** *Promise*<*Stat*<T\>\>

Defined in: [calcPopulationFromFeature.ts:12](https://github.com/cieloazul310/population/blob/902d785/packages/population-calculator/src/utils/calcPopulationFromFeature.ts#L12)
