import {AfterViewInit, Component} from '@angular/core';
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
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCard, MatSlider, MatSliderThumb, FormsModule, MatLabel, MatCardContent, MatGridList, MatGridTile, MatCheckbox],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
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

  ngAfterViewInit() {
    this.calculateProbability();
  }

  calculateProbability() {
    this.result = this._battleCalculatorService.calculateBattleResult(this.config);
    this.plotGraph();
  }

  private plotGraph() {
    let plot = Plot.plot({
      y: {percent: true},
      color: {
        type: "ordinal",
        legend: true
      },
      marks: [
        Plot.barY(this.result.resultList, Plot.groupX({y: "sum"}, {x: "survivors", y: "occurences", fill: "goodness"})),
        Plot.ruleX([0])
      ],
    });

    document.querySelector("#battle-prob-chart")!.innerHTML = "";
    document.querySelector("#battle-prob-chart")!.append(plot);
  }

  protected readonly Math = Math;
}
