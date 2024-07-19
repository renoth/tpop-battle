import {Component, Input} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {BattleresultComponent} from "./component/battleresult.component";
import {FormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {BattleConfiguration} from "./battleConfiguration";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCard, MatSlider, MatSliderThumb, BattleresultComponent, FormsModule, MatLabel, MatCardContent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tpop-battle';

  @Input() config: BattleConfiguration;

  constructor() {
    this.config = new BattleConfiguration();
  }

  calculateProbability() {

  }
}
