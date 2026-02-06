import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkOrder, CreateWorkOrderRequest, UpdateWorkOrderRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersService {
  private readonly apiUrl = '/api/work-orders';

  constructor(private http: HttpClient) { }

  getWorkOrders(): Observable<WorkOrder[]> {
    return this.http.get<WorkOrder[]>(this.apiUrl);
  }

  createWorkOrder(request: CreateWorkOrderRequest): Observable<WorkOrder> {
    return this.http.post<WorkOrder>(this.apiUrl, request);
  }

  updateWorkOrder(id: number, request: UpdateWorkOrderRequest): Observable<WorkOrder> {
    return this.http.put<WorkOrder>(`${this.apiUrl}/${id}`, request);
  }
}
