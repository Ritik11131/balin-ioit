import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericPathReplayComponent } from './generic-path-replay.component';

describe('GenericPathReplayComponent', () => {
  let component: GenericPathReplayComponent;
  let fixture: ComponentFixture<GenericPathReplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericPathReplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericPathReplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
