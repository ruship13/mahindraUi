import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAgingDaysDetailsComponent } from './master-aging-days-details.component';

describe('MasterAgingDaysDetailsComponent', () => {
  let component: MasterAgingDaysDetailsComponent;
  let fixture: ComponentFixture<MasterAgingDaysDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterAgingDaysDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasterAgingDaysDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
