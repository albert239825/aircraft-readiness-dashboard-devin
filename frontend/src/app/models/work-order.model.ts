export type Priority = 'LOW' | 'MED' | 'HIGH';
export type WorkOrderStatus = 'Draft' | 'Submitted' | 'Approved';

export interface WorkOrder {
  id: number;
  workOrderId: string;
  tailNumber: string;
  title: string;
  description: string;
  priority: Priority;
  status: WorkOrderStatus;
  createdAt: string;
}

export interface CreateWorkOrderRequest {
  tailNumber: string;
  title: string;
  description?: string;
  priority: Priority;
  status?: WorkOrderStatus;
}

export interface UpdateWorkOrderRequest {
  tailNumber?: string;
  title?: string;
  description?: string;
  priority?: Priority;
  status?: WorkOrderStatus;
}
