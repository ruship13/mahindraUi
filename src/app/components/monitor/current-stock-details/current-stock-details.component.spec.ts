import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentStockDetailsComponent } from './current-stock-details.component';

describe('CurrentStockDetailsComponent', () => {
  let component: CurrentStockDetailsComponent;
  let fixture: ComponentFixture<CurrentStockDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentStockDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentStockDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
