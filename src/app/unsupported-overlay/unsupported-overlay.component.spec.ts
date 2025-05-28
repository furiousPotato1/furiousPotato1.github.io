import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsupportedOverlayComponent } from './unsupported-overlay.component';

describe('UnsupportedOverlayComponent', () => {
  let component: UnsupportedOverlayComponent;
  let fixture: ComponentFixture<UnsupportedOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsupportedOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnsupportedOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
