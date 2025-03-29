import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLettersComponent } from './my-letters.component';

describe('MyLettersComponent', () => {
  let component: MyLettersComponent;
  let fixture: ComponentFixture<MyLettersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLettersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
