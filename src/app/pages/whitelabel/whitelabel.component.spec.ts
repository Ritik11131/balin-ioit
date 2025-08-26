import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhitelabelComponent } from './whitelabel.component';

describe('WhitelabelComponent', () => {
  let component: WhitelabelComponent;
  let fixture: ComponentFixture<WhitelabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhitelabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhitelabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
