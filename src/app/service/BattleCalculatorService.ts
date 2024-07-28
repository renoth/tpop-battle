import {Injectable} from "@angular/core";
import {BattleConfiguration} from "../domain/BattleConfiguration";
import {BattleResult} from "../domain/BattleResult";
import {DieRollResult} from "../domain/DieRollResult";

export const BATTLE_ITERATIONS: number = 100000;
const INF_HIT_MATRIX: number[][] = [[0, 1, 1, 1, 0, 0], [0, 2, 1, 1, 0, 0], [0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 1]] as const;
const INF_HIT_INF_DIE_NO_BONUS: number = 0;
const INF_HIT_DOUBLE_HIT_BONUS: number = 1;
const CAV_HIT_INF_DIE: number = 2;
const ART_HIT_INF_DIE: number = 3;

const CAV_HIT_MATRIX: number[][] = [[1, 1, 1, 0, 0, 0], [0, 0, 0, 1, 1, 1], [0, 0, 0, 0, 0, 0], [2, 1, 1, 0, 0, 0]] as const;
const INF_HIT_CAV_DIE = 0;
const CAV_HIT_CAV_DIE = 1;
const ART_HIT_CAV_DIE = 2;
const INF_HIT_CAV_DIE_BONUS = 3;

const ART_HIT_MATRIX: number[][] = [[1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 1, 1], [2, 1, 1, 0, 0, 0]] as const;
const INF_HIT_ART_DIE = 0;
const CAV_HIT_ART_DIE = 1;
const ART_HIT_ART_DIE = 2;
const INF_HIT_ART_DIE_BONUS = 3;

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
    // Once before the battle
    this.applyNobleKnightsDamage(battleConfig);

    do {
      let maxInfHitsToEnemy = battleConfig.ownSoldiers;
      let maxCavHitsToEnemy = battleConfig.ownCavalry;
      let maxArtHitsToEnemy = battleConfig.ownArtillery;
      let maxInfHitsToOwn = battleConfig.enemySoldiers;
      let maxCavHitsToOwn = battleConfig.enemyCavalry;
      let maxArtHitsToOwn = battleConfig.enemyArtillery;
      this.applyDamageToOwn(battleConfig, maxInfHitsToOwn, maxCavHitsToOwn, maxArtHitsToOwn);
      this.applyDamageToEnemy(battleConfig, maxInfHitsToEnemy, maxCavHitsToEnemy, maxArtHitsToEnemy);
    } while (!(this.getTotalUnitsOwn(battleConfig) <= 0 || this.getTotalUnitsEnemy(battleConfig) <= 0));

    // Negative count of units is not possible (Math.max ...)
    return Math.max(this.getTotalUnitsOwn(battleConfig), 0) - Math.max(this.getTotalUnitsEnemy(battleConfig), 0);
  }

  private applyDamageToOwn(battleConfig: BattleConfiguration, maxInfHitsToOwn: number, maxCavHitsToOwn: number, maxArtHitsToOwn: number) {
    let dieroll = this.rollDice(battleConfig.enemyDice, battleConfig.enemyCavalryDice, battleConfig.enemyArtilleryDice, battleConfig.enemyInfantryHitBonus)

    let maxInfGits = Math.min(maxInfHitsToOwn, dieroll.infHits);
    let maxCavHits = Math.min(maxCavHitsToOwn, dieroll.cavHits);
    let maxArtHits = Math.min(maxArtHitsToOwn, dieroll.artHits);

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

  private applyDamageToEnemy(battleConfig: BattleConfiguration, maxInfHitsToEnemy: number, maxCavHitsToEnemy: number, maxArtHitsToEnemy: number) {
    let dieroll = this.rollDice(battleConfig.ownDice, battleConfig.ownCavalryDice, battleConfig.ownArtilleryDice, battleConfig.ownInfantryHitBonus)

    let maxInfGits = Math.min(maxInfHitsToEnemy, dieroll.infHits);
    let maxCavHits = Math.min(maxCavHitsToEnemy, dieroll.cavHits);
    let maxArtHits = Math.min(maxArtHitsToEnemy, dieroll.artHits);

    let totalHits = maxInfGits + maxCavHits + maxArtHits;

    if (battleConfig.enemySoldiers > totalHits) {
      battleConfig.enemySoldiers -= totalHits;
    } else {
      totalHits -= battleConfig.enemySoldiers;
      battleConfig.enemySoldiers = 0;

      if (battleConfig.enemyCavalry > totalHits) {
        battleConfig.enemyCavalry -= totalHits;
        return;
      } else {
        totalHits -= battleConfig.enemyCavalry;
        battleConfig.enemyCavalry = 0;

        if (battleConfig.enemyArtillery > totalHits) {
          battleConfig.enemyArtillery -= totalHits;
          return;
        } else {
          battleConfig.enemyArtillery = 0;
        }
      }
    }
  }

  private rollDice(infantryDice: number, cavalryDice: number, artilleryDice: number, bonus: boolean): DieRollResult {
    let result = new DieRollResult();

    for (let i = 1; i <= infantryDice; i++) {
      const roll = Math.floor(Math.random() * 6);
      result.infHits += INF_HIT_MATRIX[bonus ? INF_HIT_DOUBLE_HIT_BONUS : INF_HIT_INF_DIE_NO_BONUS][roll];
      result.cavHits += INF_HIT_MATRIX[CAV_HIT_INF_DIE][roll];
      result.artHits += INF_HIT_MATRIX[ART_HIT_INF_DIE][roll];
    }

    for (let i = 1; i <= cavalryDice; i++) {
      const roll = Math.floor(Math.random() * 6);
      result.infHits += CAV_HIT_MATRIX[bonus ? INF_HIT_CAV_DIE_BONUS : INF_HIT_CAV_DIE][roll];
      result.cavHits += CAV_HIT_MATRIX[CAV_HIT_CAV_DIE][roll];
      result.artHits += CAV_HIT_MATRIX[ART_HIT_CAV_DIE][roll];
    }

    for (let i = 1; i <= artilleryDice; i++) {
      const roll = Math.floor(Math.random() * 6);
      result.infHits += ART_HIT_MATRIX[bonus ? INF_HIT_ART_DIE_BONUS : INF_HIT_ART_DIE][roll];
      result.cavHits += ART_HIT_MATRIX[CAV_HIT_ART_DIE][roll];
      result.artHits += ART_HIT_MATRIX[ART_HIT_ART_DIE][roll];
    }

    return result;
  }

  getTotalUnitsOwn(battleConfig: BattleConfiguration) {
    return battleConfig.ownSoldiers + battleConfig.ownCavalry + battleConfig.ownArtillery;
  }

  getTotalUnitsEnemy(battleConfig: BattleConfiguration) {
    return battleConfig.enemySoldiers + battleConfig.enemyCavalry + battleConfig.enemyArtillery;
  }

  /**
   * Applies the damage of Glorious Arms to the enemy Armies.
   * Before the battle roll Cavalry dice the number of cavalry units you have. Not more than enemy Infantry units or 6-enemy mil ideas
   * @param battleConfig
   * @private
   */
  private applyNobleKnightsDamage(battleConfig: BattleConfiguration) {
    let ownNobleKnigtsRoll = null;
    let enemyNobleKnigtsRoll = null;

    if (battleConfig.ownNobleKnights) {
      ownNobleKnigtsRoll = this.rollDice(0, Math.min(Math.min(battleConfig.enemySoldiers, battleConfig.ownCavalry), 5), 0, false);
    }

    if (battleConfig.enemyNobleKnights) {
      enemyNobleKnigtsRoll = this.rollDice(0, Math.min(Math.min(battleConfig.ownSoldiers, battleConfig.enemyCavalry), 5), 0, false);
    }

    if (ownNobleKnigtsRoll != null) {
      this.applyDamageToEnemy(battleConfig, 0, ownNobleKnigtsRoll.cavHits, 0)
    }

    if (enemyNobleKnigtsRoll != null) {
      this.applyDamageToOwn(battleConfig, 0, enemyNobleKnigtsRoll.cavHits, 0)
    }
  }
}
