export class BattleConfiguration {
  public ownSoldiers: number;
  public enemySoldiers: number;
  public ownCavalry: number;
  public enemyCavalry: number;
  public ownArtillery: number;
  public enemyArtillery: number;

  public ownDice: number;
  public ownCavalryDice: number;
  public ownArtilleryDice: number;
  public enemyDice: number;
  public enemyCavalryDice: number;
  public enemyArtilleryDice: number;

  public ownInfantryHitBonus: boolean;
  public enemyInfantryHitBonus: boolean;

  constructor() {
    this.ownSoldiers = 3;
    this.enemySoldiers = 3;
    this.ownCavalry = 0;
    this.enemyCavalry = 0;
    this.ownArtillery = 0;
    this.enemyArtillery = 0;

    this.ownDice = 3;
    this.enemyDice = 3;
    this.ownCavalryDice = 0;
    this.enemyCavalryDice = 0;
    this.ownArtilleryDice = 0;
    this.enemyArtilleryDice = 0;

    this.ownInfantryHitBonus = false;
    this.enemyInfantryHitBonus = false;
  }
}
