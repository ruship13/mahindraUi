import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProductVariantDetailsComponent } from './master-product-variant-details.component';

describe('MasterProductDetailsComponent', () => {
  let component: MasterProductVariantDetailsComponent;
  let fixture: ComponentFixture<MasterProductVariantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterProductVariantDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterProductVariantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
