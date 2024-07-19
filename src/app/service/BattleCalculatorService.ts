import {Injectable} from "@angular/core";
import {BattleConfiguration} from "../domain/BattleConfiguration";
import {BattleResult} from "../domain/BattleResult";

@Injectable()
export class BattleCalculatorService {

  calculateBattleResult(config: BattleConfiguration): BattleResult {
    return new BattleResult();
  }
}
