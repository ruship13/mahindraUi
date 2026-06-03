import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalPalletMovementComponent } from './internal-pallet-movement.component';

describe('InternalPalletMovementComponent', () => {
  let component: InternalPalletMovementComponent;
  let fixture: ComponentFixture<InternalPalletMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalPalletMovementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalPalletMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
