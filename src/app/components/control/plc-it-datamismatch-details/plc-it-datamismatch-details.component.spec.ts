import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlcItDatamismatchDetailsComponent } from './plc-it-datamismatch-details.component';

describe('PlcItDatamismatchDetailsComponent', () => {
  let component: PlcItDatamismatchDetailsComponent;
  let fixture: ComponentFixture<PlcItDatamismatchDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlcItDatamismatchDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlcItDatamismatchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
