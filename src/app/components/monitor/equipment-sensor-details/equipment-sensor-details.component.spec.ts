import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentSensorDetailsComponent } from './equipment-sensor-details.component';

describe('EquipmentSensorDetailsComponent', () => {
  let component: EquipmentSensorDetailsComponent;
  let fixture: ComponentFixture<EquipmentSensorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentSensorDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipmentSensorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
