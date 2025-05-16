import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import {   FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent {
  contactForm: FormGroup
  submitted = false

  // FAQ items
  faqItems = [
    {
      question: "How do I sign up to be a donor?",
      answer:
        'Click the "Sign Up" button at the top of the page and select "Register as Giver" to create your donor account.',
    },
    {
      question: "How are the children selected?",
      answer:
        "We partner with schools and community organizations who identify children in need. Teachers and administrators can register to submit letters on behalf of these children.",
    },
    {
      question: "Can I choose which child to help?",
      answer:
        "Yes! You can browse all available letters and select the one that speaks to you. You can also filter by age, location, and other criteria.",
    },
    {
      question: "How do I know my gift was delivered?",
      answer:
        "Once your gift is delivered, you'll receive a notification and a thank you note. We protect children's privacy, but we ensure you know your impact.",
    },
  ]

  // Office locations
  locations = [
    {
      city: "North Pole HQ",
      address: "123 Candy Cane Lane",
      phone: "(555) 123-4567",
      hours: "Mon-Fri: 9am-5pm",
    },
    {
      city: "Snowflake Office",
      address: "456 Gingerbread Ave",
      phone: "(555) 987-6543",
      hours: "Mon-Fri: 10am-6pm",
    },
  ]

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      subject: ["", Validators.required],
      message: ["", [Validators.required, Validators.minLength(10)]],
    })
  }

  onSubmit() {
    this.submitted = true

    if (this.contactForm.valid) {
      // In a real app, you would send the form data to your backend
      console.log("Form submitted:", this.contactForm.value)

      // Reset form after submission
      setTimeout(() => {
        this.contactForm.reset()
        this.submitted = false
      }, 3000)
    }
  }

  // Helper methods for form validation
  get f() {
    return this.contactForm.controls
  }

  hasError(controlName: string, errorName: string) {
    return (
      this.f[controlName].hasError(errorName) &&
      (this.f[controlName].dirty || this.f[controlName].touched || this.submitted)
    )
  }
}

