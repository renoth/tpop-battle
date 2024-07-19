import {Component, Input} from '@angular/core';
import {BattleConfiguration} from "../domain/BattleConfiguration";

@Component({
  selector: 'battle-result',
  standalone: true,
  imports: [],
  templateUrl: './battleresult.component.html',
  styleUrl: './battleresult.component.css'
})
export class BattleresultComponent {
  @Input() data!: BattleConfiguration;


}
