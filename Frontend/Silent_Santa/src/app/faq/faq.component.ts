import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-faq",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.css"],
})
export class FaqComponent {
  // FAQ categories and questions
  faqCategories = [
    {
      name: "General",
      icon: "assets/info.png",
      questions: [
        {
          question: "What is Silent Santa?",
          answer:
            "Silent Santa is a platform that connects generous donors with children in need during the holiday season. We enable school administrators to post letters from children, and donors can choose which child to help by fulfilling their Christmas wishes.",
        },
        {
          question: "How does Silent Santa work?",
          answer:
            "Our process is simple: 1) School administrators post letters from children in need, 2) Donors browse and select letters they wish to fulfill, 3) Donors prepare gifts based on the child's wishes, and 4) Gifts are delivered to the children, bringing joy and fulfilling their Christmas wishes.",
        },
        {
          question: "Is Silent Santa a non-profit organization?",
          answer:
            "Yes, Silent Santa is a registered 501(c)(3) non-profit organization. All donations are tax-deductible to the extent allowed by law.",
        },
        {
          question: "Where does Silent Santa operate?",
          answer:
            "We currently operate in multiple states across the country, with plans to expand nationwide. Our headquarters is located in the North Pole (just kidding, we're based in Seattle, but we do have that magical holiday spirit!).",
        },
      ],
    },
    {
      name: "For Donors",
      icon: "assets/donate.png",
      questions: [
        {
          question: "How do I sign up to be a donor?",
          answer:
            'Click the "Sign Up" button at the top of the page and select "Register as Giver" to create your donor account. The process takes less than 5 minutes!',
        },
        {
          question: "Can I choose which child to help?",
          answer:
            "You can browse all available letters and select the one that speaks to you. You can also filter by age, location, and other criteria to find a perfect match.",
        },
        {
          question: "Is there a minimum or maximum spending amount?",
          answer:
            "We don't set specific spending limits. We encourage donors to focus on fulfilling the child's wishes within their own budget. The joy comes from the thoughtfulness, not the price tag.",
        },
        {
          question: "How do I know my gift was delivered?",
          answer:
            "Once your gift is delivered, you'll receive a notification and a thank you note. We protect children's privacy, but we ensure you know your impact.",
        },
        {
          question: "Can I donate anonymously?",
          answer:
            "Yes! You can choose to remain anonymous when fulfilling a child's wishes. Your personal information will never be shared with the recipients.",
        },
      ],
    },
    {
      name: "For Schools",
      icon: "assets/school.png",
      questions: [
        {
          question: "How can our school participate?",
          answer:
            'School administrators can register on our platform by selecting "Register as Helper" during sign-up. After verification, you\'ll be able to submit letters from children in need at your school.',
        },
        {
          question: "What information do we need to provide about the children?",
          answer:
            "We require basic information like first name, age, gender, and their wish list. We prioritize child privacy and safety, so last names and specific identifying details are never shared publicly.",
        },
        {
          question: "How are children selected for the program?",
          answer:
            "Schools identify children who would benefit most from the program based on economic need. We trust our school partners to determine eligibility according to their knowledge of their student population.",
        },
        {
          question: "Is there a limit to how many letters our school can submit?",
          answer:
            "There's no strict limit, but we encourage schools to prioritize children with the greatest need. If you have a large number of letters, please contact us directly so we can work together to accommodate them.",
        },
      ],
    },
    {
      name: "Gifts & Delivery",
      icon: "assets/gift-bag.png",
      questions: [
        {
          question: "What types of gifts are appropriate?",
          answer:
            "We encourage donors to fulfill the specific wishes listed in the child's letter. Appropriate gifts include toys, books, clothing, school supplies, and other items suitable for the child's age and interests.",
        },
        {
          question: "How are gifts delivered to the children?",
          answer:
            "Gifts are delivered to the school, where administrators distribute them to the children. This ensures security and maintains the anonymity of both donors and recipients if desired.",
        },
        {
          question: "When is the deadline for sending gifts?",
          answer:
            "We recommend completing your gift preparation by December 15th to ensure delivery before Christmas. However, specific deadlines may vary by region and will be clearly indicated on the platform.",
        },
        {
          question: "Can I include a personal note with my gift?",
          answer:
            "Yes! We encourage donors to include a heartfelt note with their gifts. It adds a personal touch that makes the experience even more special for the child.",
        },
      ],
    },
    {
      name: "Technical Support",
      icon: "assets/support.png",
      questions: [
        {
          question: "I'm having trouble with my account. What should I do?",
          answer:
            "Please visit our Contact page and send us a message describing the issue. Our technical support team will respond within 24 hours to help resolve any problems.",
        },
        {
          question: "Is my personal information secure?",
          answer:
            "Yes, we take data security very seriously. We use industry-standard encryption and security measures to protect all personal information. Please see our Privacy Policy for more details.",
        },
        {
          question: "Can I use Silent Santa on my mobile device?",
          answer:
            "Our website is fully responsive and works seamlessly on smartphones and tablets, allowing you to browse letters and manage your account on the go.",
        },
      ],
    },
  ]

  // Track which questions are expanded
  expandedQuestions: { [key: string]: boolean } = {}

  // Toggle question expansion
  toggleQuestion(categoryIndex: number, questionIndex: number) {
    const key = `${categoryIndex}-${questionIndex}`
    this.expandedQuestions[key] = !this.expandedQuestions[key]
  }

  // Check if a question is expanded
  isExpanded(categoryIndex: number, questionIndex: number): boolean {
    const key = `${categoryIndex}-${questionIndex}`
    return this.expandedQuestions[key] === true
  }
}

