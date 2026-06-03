import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureMissionRuntimeDetailsComponent } from './temperature-mission-runtime-details.component';

describe('TemperatureMissionRuntimeDetailsComponent', () => {
  let component: TemperatureMissionRuntimeDetailsComponent;
  let fixture: ComponentFixture<TemperatureMissionRuntimeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemperatureMissionRuntimeDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemperatureMissionRuntimeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
