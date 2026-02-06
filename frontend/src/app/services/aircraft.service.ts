import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aircraft, AircraftDetail } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AircraftService {
  private readonly apiUrl = '/api/aircraft';

  constructor(private http: HttpClient) { }

  getAircraft(): Observable<Aircraft[]> {
    return this.http.get<Aircraft[]>(this.apiUrl);
  }

  getAircraftById(id: string): Observable<AircraftDetail> {
    return this.http.get<AircraftDetail>(`${this.apiUrl}/${id}`);
  }
}
