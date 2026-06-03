import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockdrillMissionDetailsComponent } from './mockdrill-mission-details.component';

describe('MockdrillMissionDetailsComponent', () => {
  let component: MockdrillMissionDetailsComponent;
  let fixture: ComponentFixture<MockdrillMissionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockdrillMissionDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MockdrillMissionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
