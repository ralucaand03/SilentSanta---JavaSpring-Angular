import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-privacy-policy",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./privacy-policy.component.html",
  styleUrls: ["./privacy-policy.component.css"],
})
export class PrivacyPolicyComponent {
  // Last updated date
  lastUpdated = "November 15, 2023"

  // Policy sections
  policySections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      content: [
        "We collect several types of information from and about users of our Website, including:",
        "Personal information you provide when registering, such as your name, email address, postal address, and phone number.",
        "Information about your role (donor or school administrator) and preferences.",
        "For school administrators, information about the children for whom you are submitting letters, including first name, age, gender, and wish lists.",
        "For donors, information about your gift selections and delivery preferences.",
        "Information about your device and internet connection, including your IP address, browser type, and operating system.",
      ],
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      content: [
        "We use the information we collect to:",
        "Provide, maintain, and improve our services.",
        "Process and fulfill your requests to submit or fulfill letters.",
        "Communicate with you about your account, donations, or requests.",
        "Send you updates about our organization and impact.",
        "Analyze usage patterns to enhance user experience.",
        "Protect against fraudulent or unauthorized activity.",
      ],
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      content: [
        "We may share your information in the following circumstances:",
        "With schools and donors as necessary to facilitate the letter fulfillment process.",
        "With service providers who perform services on our behalf, such as payment processing and email delivery.",
        "To comply with legal obligations or respond to lawful requests.",
        "To protect the rights, property, or safety of Silent Santa, our users, or others.",
        "In connection with a merger, sale, or acquisition of all or a portion of our organization.",
        "We never sell your personal information to third parties for marketing purposes.",
      ],
    },
    {
      id: "children-privacy",
      title: "Children's Privacy",
      content: [
        "We take children's privacy very seriously:",
        "We never collect personal information directly from children under 13.",
        "All information about children is provided by authorized school administrators.",
        "We limit the information collected about children to what is necessary for the program (first name, age, gender, and wish list).",
        "We never share children's last names or contact information publicly.",
        "We obtain appropriate consent from schools, who act as the children's representatives.",
      ],
    },
    {
      id: "data-security",
      title: "Data Security",
      content: [
        "We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, or destruction.",
        "We use encryption, secure servers, and regular security assessments to safeguard your data.",
        "While we strive to protect your information, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
        "We regularly review and update our security practices to maintain the highest standards of protection.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      content: [
        "We use cookies and similar technologies to:",
        "Remember your preferences and settings.",
        "Understand how you interact with our Website.",
        "Improve your user experience.",
        "Analyze the performance of our Website.",
        "You can control cookies through your browser settings, but disabling cookies may limit some features of our Website.",
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights and Choices",
      content: [
        "Depending on your location, you may have certain rights regarding your personal information:",
        "Access and review the information we hold about you.",
        "Correct inaccurate or incomplete information.",
        "Request deletion of your information in certain circumstances.",
        "Opt out of marketing communications.",
        "To exercise these rights, please contact us using the information provided at the end of this policy.",
      ],
    },
    {
      id: "policy-changes",
      title: "Changes to This Privacy Policy",
      content: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.",
        'We will notify you of any material changes by posting the updated policy on our Website and updating the "Last Updated" date.',
        "Your continued use of our Website after such modifications constitutes your acknowledgment of the modified policy.",
      ],
    },
    {
      id: "contact-us",
      title: "Contact Us",
      content: [
        "If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:",
        "Email: silent.santa25@gmail.com",
        "Address: 123 Candy Cane Lane, North Pole, AK 99705",
        "Phone: (555) 123-GIFT",
      ],
    },
  ]
}

