import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  // Team members data
  teamMembers = [
    {
      name: 'Emma Johnson',
      role: 'Founder & Director',
      bio: 'Emma started Silent Santa after volunteering at a local school and seeing the need for holiday support. Her background in education and passion for community service drives our mission.',
      image: 'assets/elfy_icon.png'
    },
    {
      name: 'Michael Chen',
      role: 'Technology Lead',
      bio: 'Michael brings 10 years of tech experience to Silent Santa. He built our platform from the ground up, ensuring a seamless experience for both donors and volunteers.',
      image: 'assets/elf_icon.png'
    },
    {
      name: 'Sofia Rodriguez',
      role: 'Community Outreach',
      bio: 'Sofia coordinates with schools and community centers to identify children in need. Her warm personality and organizational skills help us reach more families every year.',
      image: 'assets/elfy_icon.png'
    }
  ];

  // Timeline events
  milestones = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'Silent Santa was born from a simple idea: connect generous donors directly with children in need during the holiday season.'
    },
    {
      year: '2021',
      title: 'First 100 Letters',
      description: 'We celebrated our first major milestone - 100 children received gifts through our platform!'
    },
    {
      year: '2022',
      title: 'School Partnerships',
      description: 'We established formal partnerships with 15 schools across the region, expanding our reach to more communities.'
    },
    {
      year: '2023',
      title: 'Digital Platform Launch',
      description: 'Our website launched, making it easier than ever for donors to browse letters and fulfill wishes.'
    },
    {
      year: '2024',
      title: 'Going National',
      description: 'Silent Santa expanded beyond our local roots, now serving children in multiple states.'
    }
  ];

  // Values
  coreValues = [
    {
      title: 'Kindness',
      description: 'We believe in the transformative power of simple acts of kindness.',
      icon: 'assets/heart.png'
    },
    {
      title: 'Dignity',
      description: 'Every child deserves to feel special, regardless of their circumstances.',
      icon: 'assets/star.png'
    },
    
    {
      title: 'Community',
      description: 'We are stronger together - donors, volunteers, and families creating joy.',
      icon: 'assets/help.png'
    },
    {
      title: 'Transparency',
      description: 'We are committed to clear communication and responsible stewardship.',
      icon: 'assets/christmas-wreath.png'
    }
  ];
}
