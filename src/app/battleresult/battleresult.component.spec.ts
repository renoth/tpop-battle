import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BattleresultComponent} from './battleresult.component';

describe('BattleresultComponent', () => {
  let component: BattleresultComponent;
  let fixture: ComponentFixture<BattleresultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleresultComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BattleresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
