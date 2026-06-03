import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferpalletMissionRuntimeDetailsComponent } from './transferpallet-mission-runtime-details.component';

describe('TransferpalletMissionRuntimeDetailsComponent', () => {
  let component: TransferpalletMissionRuntimeDetailsComponent;
  let fixture: ComponentFixture<TransferpalletMissionRuntimeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferpalletMissionRuntimeDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransferpalletMissionRuntimeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
