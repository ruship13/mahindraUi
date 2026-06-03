import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorysummaryReportComponent } from './inventory-summary-report.component';

describe('AgingDayReportComponent', () => {
  let component: InventorysummaryReportComponent;
  let fixture: ComponentFixture<InventorysummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorysummaryReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventorysummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
