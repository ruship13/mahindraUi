import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutfeedMissionRuntimeDetailsComponent } from './outfeed-mission-runtime-details.component';

describe('OutfeedMissionRuntimeDetailsComponent', () => {
  let component: OutfeedMissionRuntimeDetailsComponent;
  let fixture: ComponentFixture<OutfeedMissionRuntimeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutfeedMissionRuntimeDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutfeedMissionRuntimeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
