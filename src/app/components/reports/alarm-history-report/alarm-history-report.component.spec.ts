import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmHistoryReportComponent } from './alarm-history-report.component';

describe('AlarmHistoryReportComponent', () => {
  let component: AlarmHistoryReportComponent;
  let fixture: ComponentFixture<AlarmHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlarmHistoryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlarmHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
