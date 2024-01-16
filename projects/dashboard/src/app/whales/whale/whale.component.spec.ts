import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhaleComponent } from './whale.component';

describe('WhaleComponent', () => {
  let component: WhaleComponent;
  let fixture: ComponentFixture<WhaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WhaleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
