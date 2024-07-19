import {BATTLE_ITERATIONS} from "../service/BattleCalculatorService";

export class BattleResult {
  public _resultHistogram: Map<number, number>;

  constructor(resultHistogram: Map<number, number>) {
    this._resultHistogram = resultHistogram;
  }

  public getWinProbability() {
    let winOutcomes = [...this._resultHistogram].filter(([k, v]) => k > 0).reduce((sum, [k, v]) => sum + v, 0);
    return winOutcomes / BATTLE_ITERATIONS
  }
}
