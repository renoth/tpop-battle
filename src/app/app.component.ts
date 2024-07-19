import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {BattleConfiguration} from "./domain/BattleConfiguration";
import {BattleCalculatorService} from "./service/BattleCalculatorService";
import {BattleResult} from "./domain/BattleResult";
import * as Plot from '@observablehq/plot';
import * as  packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCard, MatSlider, MatSliderThumb, FormsModule, MatLabel, MatCardContent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tpop-battle';
  version = packageJson.version;

  config: BattleConfiguration;
  protected result: BattleResult;
  private _battleCalculatorService: BattleCalculatorService;

  constructor(battleCalculatorService: BattleCalculatorService) {
    this._battleCalculatorService = battleCalculatorService;
    this.config = new BattleConfiguration();
    this.result = this._battleCalculatorService.calculateBattleResult(this.config);
  }

  calculateProbability() {
    this.result = this._battleCalculatorService.calculateBattleResult(this.config);
    console.warn(this.result.resultHistogram);

    var plot = Plot.plot({
      y: {percent: true},
      color: {
        type: "diverging",
        scheme: "BuRd"
      },
      marks: [
        Plot.barY(this.result.resultList, {x: "survivors", y: "occurences"}),
        Plot.ruleY(this.result.resultList.keys())
      ]
    });

    document.querySelector("#battle-prob-chart")!.innerHTML = "";
    document.querySelector("#battle-prob-chart")!.append(plot);
  }

  protected readonly Math = Math;
}
