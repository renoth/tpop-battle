export class BattleConfiguration {
    public ownSoldiers: number;
    public enemySoldiers: number;
    public ownDice: number;
    public ownCavalryDice: number;
    public ownArtilleryDice: number;
    public enemyDice: number;
    public enemyCavalryDice: number;
    public enemyArtilleryDice: number;

    constructor() {
        this.ownSoldiers = 3;
        this.enemySoldiers = 3;
        this.ownDice = 3;
        this.enemyDice = 3;
        this.ownCavalryDice = 0;
        this.enemyCavalryDice = 0;
        this.ownArtilleryDice = 0;
        this.enemyArtilleryDice = 0;
    }
}
