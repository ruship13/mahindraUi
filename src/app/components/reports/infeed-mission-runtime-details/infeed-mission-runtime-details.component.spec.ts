import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfeedMissionRuntimeDetailsComponent } from './infeed-mission-runtime-details.component';

describe('InfeedMissionRuntimeDetailsComponent', () => {
  let component: InfeedMissionRuntimeDetailsComponent;
  let fixture: ComponentFixture<InfeedMissionRuntimeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfeedMissionRuntimeDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfeedMissionRuntimeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
