export class BattleConfiguration {
    public ownSoldiers: number;
    public enemySoldiers: number;
    public ownDice: number;
    public enemyDice: number;

    constructor() {
        this.ownSoldiers = 3;
        this.enemySoldiers = 3;
        this.ownDice = 3;
        this.enemyDice = 3;
    }
}
