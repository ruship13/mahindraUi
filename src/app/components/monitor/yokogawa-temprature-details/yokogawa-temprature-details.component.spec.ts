import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YokogawaTempratureDetailsComponent } from './yokogawa-temprature-details.component';

describe('YokogawaTempratureDetailsComponent', () => {
  let component: YokogawaTempratureDetailsComponent;
  let fixture: ComponentFixture<YokogawaTempratureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YokogawaTempratureDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YokogawaTempratureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
