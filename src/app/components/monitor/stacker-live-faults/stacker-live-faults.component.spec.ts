import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackerLiveFaultsComponent } from './stacker-live-faults.component';

describe('StackerLiveFaultsComponent', () => {
  let component: StackerLiveFaultsComponent;
  let fixture: ComponentFixture<StackerLiveFaultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StackerLiveFaultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StackerLiveFaultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
