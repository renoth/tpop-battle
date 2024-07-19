import {Injectable} from "@angular/core";
import {BattleConfiguration} from "../domain/BattleConfiguration";
import {BattleResult} from "../domain/BattleResult";

export const BATTLE_ITERATIONS: number = 100000;
const INF_HIT_MATRIX: number[][] = [[0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 1]] as const;
const INF_WITH_INF_DIE: number = 0;

@Injectable({providedIn: 'root'})
export class BattleCalculatorService {

  calculateBattleResult(config: BattleConfiguration): BattleResult {
    // Copy input to not destroy browserinput
    let resultMap: Map<number, number> = new Map()

    for (let i = 0; i < BATTLE_ITERATIONS; i++) {
      const result = this.simulateBattle(structuredClone(config))
      let currentValue = resultMap.get(result);

      if (currentValue === undefined) {
        resultMap.set(result, 1);
      } else {
        resultMap.set(result, currentValue + 1);
      }
    }

    // Sort by key (difference in Units, negative means Opponent has some left)
    resultMap = new Map([...resultMap.entries()].sort((a, b) => {
      return a[0] - b[0];
    }));

    return new BattleResult(resultMap);
  }

  /**
   * Core logic. This simulates a battle between 2 armies with the data provided by BattleConfig.
   * No retreats are done by any combatant.
   * @param battleConfig
   * @private
   */
  private simulateBattle(battleConfig: BattleConfiguration): number {
    do {
      let ownHits = this.simulateHits(battleConfig.ownDice);
      let enemyHits = this.simulateHits(battleConfig.enemyDice);
      let maxHitsThisRoundToOwnSoldiers = battleConfig.enemySoldiers;
      let maxHitsThisRoundToEnemySoldiers = battleConfig.ownSoldiers;

      // Apply damage, at most own number of soldiers (Math.min ...)
      battleConfig.ownSoldiers -= Math.min(enemyHits, maxHitsThisRoundToOwnSoldiers);
      battleConfig.enemySoldiers -= Math.min(ownHits, maxHitsThisRoundToEnemySoldiers);
    } while (!(battleConfig.ownSoldiers <= 0 || battleConfig.enemySoldiers <= 0));

    // Negative count of units is not possible (Math.max ...)
    return Math.max(battleConfig.ownSoldiers, 0) - Math.max(battleConfig.enemySoldiers, 0);
  }

  private simulateHits(diceCount: number) {
    console.assert(diceCount >= 1);

    let hits = 0;

    for (let i = 1; i <= diceCount; i++) {
      const roll = Math.floor(Math.random() * 6);
      hits += INF_HIT_MATRIX[INF_WITH_INF_DIE][roll];
    }

    return hits;
  }
}
