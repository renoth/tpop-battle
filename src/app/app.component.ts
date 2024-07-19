import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {BattleConfiguration} from "./domain/BattleConfiguration";
import {BattleCalculatorService} from "./service/BattleCalculatorService";
import {BattleResult} from "./domain/BattleResult";
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCard, MatSlider, MatSliderThumb, FormsModule, MatLabel, MatCardContent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tpop-battle';

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
    console.warn(this.result._resultHistogram);

    const data = [30, 200, 100, 400, 150, 250];
    const svg = d3.select("battle-prob-chart").append("svg")
      .attr("width", 700)
      .attr("height", 300);

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 70)
      .attr("y", d => 300 - d)
      .attr("width", 65)
      .attr("height", d => d)
      .attr("fill", "blue");
  }

  protected readonly Math = Math;
}
