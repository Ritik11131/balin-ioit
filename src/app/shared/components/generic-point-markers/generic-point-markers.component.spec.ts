import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericPointMarkersComponent } from './generic-point-markers.component';

describe('GenericPointMarkersComponent', () => {
  let component: GenericPointMarkersComponent;
  let fixture: ComponentFixture<GenericPointMarkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericPointMarkersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericPointMarkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
