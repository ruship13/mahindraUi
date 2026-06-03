import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterReasonDetailsComponent } from './master-reason-details.component';

describe('MasterReasonDetailsComponent', () => {
  let component: MasterReasonDetailsComponent;
  let fixture: ComponentFixture<MasterReasonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterReasonDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterReasonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
