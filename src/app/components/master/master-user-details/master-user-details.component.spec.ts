import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterUserDetailsComponent } from './master-user-details.component';

describe('MasterUserDetailsComponent', () => {
  let component: MasterUserDetailsComponent;
  let fixture: ComponentFixture<MasterUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterUserDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
