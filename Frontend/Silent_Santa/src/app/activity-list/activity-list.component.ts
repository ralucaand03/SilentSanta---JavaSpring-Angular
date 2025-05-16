import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivityService } from '../services/activity.service';
import { Activity, ActivityFilter } from '../models/activity.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  activities: Activity[] = [];
  loading = false;
  error = '';
  successMessage = '';
  filterForm: FormGroup;
  isAdmin = false;
  
  constructor(
    private activityService: ActivityService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      activityType: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    // Check if user is admin
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.role === 'ADMIN') {
      this.isAdmin = true;
      this.loadActivities();
    } else {
      this.router.navigate(['/']);
    }
  }

  loadActivities(): void {
    this.loading = true;
    this.error = '';
    
    this.activityService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load activities';
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const filter: ActivityFilter = {};
    
    if (this.filterForm.value.activityType) {
      filter.activityType = this.filterForm.value.activityType;
    }
    
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      filter.startDate = new Date(this.filterForm.value.startDate);
      filter.endDate = new Date(this.filterForm.value.endDate);
    }
    
    this.loading = true;
    this.error = '';
    
    this.activityService.getFilteredActivities(filter).subscribe({
      next: (data) => {
        this.activities = data;
        this.loading = false;
        
        if (data.length === 0) {
          this.successMessage = 'No activities found matching your filters.';
        } else {
          this.successMessage = '';
        }
      },
      error: (err) => {
        this.error = 'Failed to filter activities';
        console.error(err);
        this.loading = false;
      }
    });
  }

  resetFilter(): void {
    this.filterForm.reset();
    this.successMessage = '';
    this.loadActivities();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}