import {BATTLE_ITERATIONS} from "../service/BattleCalculatorService";

class BattleResultEntry {
  public survivors: number;
  public occurences: number;
  public goodness: String;

  constructor(survivors: number, occurences: number, goodness: string) {
    this.survivors = survivors;
    this.occurences = occurences;
    this.goodness = goodness;
  }
}

export class BattleResult {
  public resultHistogram: Map<number, number>;
  public resultList: BattleResultEntry[];

  constructor(resultHistogram: Map<number, number>) {
    this.resultHistogram = resultHistogram;
    let resultList = [] as BattleResultEntry[];
    [...this.resultHistogram].filter(([k, v]) => v > 0).forEach(entry => resultList.push(new BattleResultEntry(entry[0], entry[1], entry[0] > 0 ? "good" : "bad")));
    this.resultList = resultList;
  }

  public getWinProbability() {
    let winOutcomes = [...this.resultHistogram].filter(([k, v]) => k > 0).reduce((sum, [k, v]) => sum + v, 0);
    return winOutcomes / BATTLE_ITERATIONS
  }

  getMinSurvivors() {
    return;
  }
}
