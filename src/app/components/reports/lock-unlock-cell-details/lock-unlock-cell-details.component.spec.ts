import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockUnlockCellDetailsComponent } from './lock-unlock-cell-details.component';

describe('LockUnlockCellDetailsComponent', () => {
  let component: LockUnlockCellDetailsComponent;
  let fixture: ComponentFixture<LockUnlockCellDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LockUnlockCellDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LockUnlockCellDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
