import {Component, Input, SimpleChanges} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatCard} from "@angular/material/card";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {BattleresultComponent} from "./battleresult/battleresult.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCard, MatSlider, MatSliderThumb, BattleresultComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tpop-battle';
  @Input() ownSoldiers: number;
  @Input() enemySoldiers: number;

  constructor() {
    this.ownSoldiers = 0;
    this.enemySoldiers = 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }
}
