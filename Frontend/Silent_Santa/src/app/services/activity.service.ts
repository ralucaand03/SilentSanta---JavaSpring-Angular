import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity, ActivityFilter } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private baseUrl = 'http://localhost:8080/api/activities';

  constructor(private http: HttpClient) { }

  getAllActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.baseUrl);
  }

  getActivitiesByUser(userId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/user/${userId}`);
  }

  getActivitiesByType(type: 'LOGIN' | 'LOGOUT'): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/type/${type}`);
  }

  getActivitiesByDateRange(start: Date, end: Date): Observable<Activity[]> {
    let params = new HttpParams()
      .set('start', start.toISOString())
      .set('end', end.toISOString());
    
    return this.http.get<Activity[]>(`${this.baseUrl}/date-range`, { params });
  }

  getFilteredActivities(filter: ActivityFilter): Observable<Activity[]> {
    if (filter.userId) {
      return this.getActivitiesByUser(filter.userId);
    } else if (filter.activityType) {
      return this.getActivitiesByType(filter.activityType);
    } else if (filter.startDate && filter.endDate) {
      return this.getActivitiesByDateRange(filter.startDate, filter.endDate);
    } else {
      return this.getAllActivities();
    }
  }
}