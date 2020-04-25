import {Substance} from './substance';


export class SubstanceWithProportion {
  substance: Substance;
  proportion: number;
}

export class Solution {
  substances: SubstanceWithProportion[] = [];
  water = 0;
  impurities = 0;
}
