import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { WorkOrder } from '../../models';
import { WorkOrdersService } from '../../services/work-orders.service';
import { WorkOrderFormComponent } from '../work-order-form/work-order-form.component';

@Component({
  selector: 'app-work-order-list',
  templateUrl: './work-order-list.component.html',
  styleUrls: ['./work-order-list.component.scss']
})
export class WorkOrderListComponent implements OnInit {
  displayedColumns: string[] = ['workOrderId', 'tailNumber', 'title', 'priority', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<WorkOrder>([]);
  isLoading = true;
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private workOrdersService: WorkOrdersService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadWorkOrders();
  }

  loadWorkOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.workOrdersService.getWorkOrders().subscribe({
      next: (workOrders) => {
        this.dataSource.data = workOrders;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load work orders';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onCreateWorkOrder(): void {
    const dialogRef = this.dialog.open(WorkOrderFormComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadWorkOrders();
      }
    });
  }

  onEditWorkOrder(workOrder: WorkOrder): void {
    const dialogRef = this.dialog.open(WorkOrderFormComponent, {
      width: '600px',
      data: { mode: 'edit', workOrder }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadWorkOrders();
      }
    });
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'priority-high';
      case 'MED': return 'priority-med';
      default: return 'priority-low';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved': return 'status-approved';
      case 'Submitted': return 'status-submitted';
      default: return 'status-draft';
    }
  }
}
