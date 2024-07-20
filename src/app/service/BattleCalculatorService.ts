import {Injectable} from "@angular/core";
import {BattleConfiguration} from "../domain/BattleConfiguration";
import {BattleResult} from "../domain/BattleResult";

export const BATTLE_ITERATIONS: number = 100000
const INF_HIT_MATRIX: number[][] = [[0, 1, 1, 1, 0, 0], [0, 2, 1, 1, 0, 0]] as const;
const CAV_HIT_MATRIX: number[][] = [[0, 0, 0, 0, 1, 0], [0, 0, 0, 1, 1, 1], [0, 0, 0, 0, 0, 1]] as const;
const ART_HIT_MATRIX: number[][] = [[0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 1], [0, 0, 0, 1, 1, 1]] as const;
const INF_HIT_NO_BONUS: number = 0;
const INF_HIT_DOUBLE_HIT_BONUS: number = 1;
const CAV_HIT_INF_DIE = 0;
const CAV_HIT_CAV_DIE = 1;
const CAV_HIT_ART_DIE = 2;
const ART_HIT_INF_DIE = 0;
const ART_HIT_CAV_DIE = 1;
const ART_HIT_ART_DIE = 2;

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
      this.applyDamageToOwn(battleConfig);
      this.applyDamageToEnemy(battleConfig);
    } while (!(this.getTotalUnitsOwn(battleConfig) <= 0 || this.getTotalUnitsEnemy(battleConfig) <= 0));

    // Negative count of units is not possible (Math.max ...)
    return Math.max(this.getTotalUnitsOwn(battleConfig), 0) - Math.max(this.getTotalUnitsEnemy(battleConfig), 0);
  }

  private applyDamageToOwn(battleConfig: BattleConfiguration) {
    let enemyInfHits = this.simulateInfantryHits(battleConfig.enemyDice, battleConfig.enemyCavalryDice, battleConfig.enemyArtilleryDice);
    let enemyCavHits = this.simulateCavalryHits(battleConfig.enemyDice, battleConfig.enemyCavalryDice, battleConfig.enemyArtilleryDice);
    let enemyArtHits = this.simulateArtilleryHits(battleConfig.enemyDice, battleConfig.enemyCavalryDice, battleConfig.enemyArtilleryDice);

    let maxInfGits = Math.min(battleConfig.enemySoldiers, enemyInfHits);
    let maxCavHits = Math.min(battleConfig.enemyCavalry, enemyCavHits);
    let maxArtHits = Math.min(battleConfig.enemyArtillery, enemyArtHits);

    let totalHits = maxInfGits + maxCavHits + maxArtHits;

    if (battleConfig.ownSoldiers > totalHits) {
      battleConfig.ownSoldiers -= totalHits;
    } else {
      totalHits -= battleConfig.ownSoldiers;
      battleConfig.ownSoldiers = 0;

      if (battleConfig.ownCavalry > totalHits) {
        battleConfig.ownCavalry -= totalHits;
        return;
      } else {
        totalHits -= battleConfig.ownCavalry;
        battleConfig.ownCavalry = 0;

        if (battleConfig.ownArtillery > totalHits) {
          battleConfig.ownArtillery -= totalHits;
          return;
        } else {
          battleConfig.ownArtillery = 0;
        }
      }
    }
  }

  private applyDamageToEnemy(battleConfig: BattleConfiguration) {
    let infHits = this.simulateInfantryHits(battleConfig.ownDice, battleConfig.ownCavalryDice, battleConfig.ownArtilleryDice);
    let cavHits = this.simulateCavalryHits(battleConfig.ownDice, battleConfig.ownCavalryDice, battleConfig.ownArtilleryDice);
    let artHits = this.simulateArtilleryHits(battleConfig.ownDice, battleConfig.ownCavalryDice, battleConfig.ownArtilleryDice);

    let maxInfGits = Math.min(battleConfig.ownSoldiers, infHits);
    let maxCavHits = Math.min(battleConfig.ownCavalry, cavHits);
    let maxArtHits = Math.min(battleConfig.ownArtillery, artHits);

    let totalHits = maxInfGits + maxCavHits + maxArtHits;

    if (battleConfig.ownSoldiers > totalHits) {
      battleConfig.ownSoldiers -= totalHits;
    } else {
      totalHits -= battleConfig.ownSoldiers;
      battleConfig.ownSoldiers = 0;

      if (battleConfig.ownCavalry > totalHits) {
        battleConfig.ownCavalry -= totalHits;
        return;
      } else {
        totalHits -= battleConfig.ownCavalry;
        battleConfig.ownCavalry = 0;

        if (battleConfig.ownArtillery > totalHits) {
          battleConfig.ownArtillery -= totalHits;
          return;
        } else {
          battleConfig.ownArtillery = 0;
        }
      }
    }
  }

  private simulateInfantryHits(infantryDice: number, cavalryDice: number, artilleryDice: number) {
    let hits = 0;
    let totalNumberRolls = infantryDice + cavalryDice + artilleryDice;

    for (let i = 1; i <= totalNumberRolls; i++) {
      const roll = Math.floor(Math.random() * 6);
      hits += INF_HIT_MATRIX[INF_HIT_NO_BONUS][roll];
    }

    return hits;
  }

  private simulateCavalryHits(infantryDice: number, cavalryDice: number, artilleryDice: number) {
    let hits = 0;

    for (let i = 1; i <= infantryDice; i++) {
      const roll = Math.floor(Math.random() * 6);
      hits += CAV_HIT_MATRIX[CAV_HIT_INF_DIE][roll];
    }

    for (let i = 1; i <= cavalryDice; i++) {
      const roll = Math.floor(Math.random() * 6);
      hits += CAV_HIT_MATRIX[CAV_HIT_CAV_DIE][roll];
    }

    for (let i = 1; i <= artilleryDice; i++) {
      const roll = Math.floor(Math.random() * 6);
      hits += CAV_HIT_MATRIX[CAV_HIT_ART_DIE][roll];
    }

    return hits;
  }

  private simulateArtilleryHits(infantryDice: number, cavalryDice: number, artilleryDice: number) {
    let hits = 0;

    for (let i = 1; i <= infantryDice; i++) {
      const roll = Math.floor(Math.random() * 6);
      hits += ART_HIT_MATRIX[ART_HIT_INF_DIE][roll];
    }

    for (let i = 1; i <= cavalryDice; i++) {
      const roll = Math.floor(Math.random() * 6);
      hits += ART_HIT_MATRIX[ART_HIT_CAV_DIE][roll];
    }

    for (let i = 1; i <= artilleryDice; i++) {
      const roll = Math.floor(Math.random() * 6);
      hits += ART_HIT_MATRIX[ART_HIT_ART_DIE][roll];
    }

    return hits;
  }

  getTotalUnitsOwn(battleConfig: BattleConfiguration) {
    return battleConfig.ownSoldiers + battleConfig.ownCavalry + battleConfig.ownArtillery;
  }

  getTotalUnitsEnemy(battleConfig: BattleConfiguration) {
    return battleConfig.enemySoldiers + battleConfig.enemyCavalry + battleConfig.enemyArtillery;
  }
}
