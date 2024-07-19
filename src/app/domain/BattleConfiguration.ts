export class BattleConfiguration {
    public ownSoldiers: number;
    public enemySoldiers: number;
    public ownDice: number;
    public enemyDice: number;

    constructor() {
        this.ownSoldiers = 0;
        this.enemySoldiers = 0;
        this.ownDice = 3;
        this.enemyDice = 3;
    }
}
