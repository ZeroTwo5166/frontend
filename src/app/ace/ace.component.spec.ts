import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceComponent } from './ace.component';

describe('AceComponent', () => {
  let component: AceComponent;
  let fixture: ComponentFixture<AceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
