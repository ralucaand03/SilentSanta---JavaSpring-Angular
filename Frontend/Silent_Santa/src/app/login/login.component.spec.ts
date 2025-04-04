import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { HeaderComponent } from '../header/header.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    // Configure the testing module
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule]  // Import FormsModule for ngModel support
    }).compileComponents();
  });

  beforeEach(() => {
    // Create the component instance
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // Trigger change detection to update the component state
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();  // Check if the component is created successfully
  });


  it('should call onLoginSubmit when form is submitted', () => {
    spyOn(component, 'onLoginSubmit');  // Spy on the onLoginSubmit method to check if it's called
    const button = fixture.nativeElement.querySelector('button');  // Get the submit button
    button.click();  // Simulate a click on the button

    expect(component.onLoginSubmit).toHaveBeenCalled();  // Check if the method was called
  });
});
