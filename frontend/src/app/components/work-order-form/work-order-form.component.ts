import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Aircraft, Priority, WorkOrder, WorkOrderStatus } from '../../models';
import { WorkOrdersService } from '../../services/work-orders.service';
import { AircraftService } from '../../services/aircraft.service';

@Component({
  selector: 'app-work-order-form',
  templateUrl: './work-order-form.component.html',
  styleUrls: ['./work-order-form.component.scss']
})
export class WorkOrderFormComponent implements OnInit {
  form!: FormGroup;
  aircraft: Aircraft[] = [];
  priorities: Priority[] = ['LOW', 'MED', 'HIGH'];
  statuses: WorkOrderStatus[] = ['Draft', 'Submitted', 'Approved'];
  isLoading = false;
  errorMessage = '';
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private workOrdersService: WorkOrdersService,
    private aircraftService: AircraftService,
    private dialogRef: MatDialogRef<WorkOrderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; workOrder?: WorkOrder }
  ) {
    this.isEditMode = data.mode === 'edit';
  }

  ngOnInit(): void {
    this.initForm();
    this.loadAircraft();
  }

  initForm(): void {
    const workOrder = this.data.workOrder;
    
    this.form = this.fb.group({
      tailNumber: [workOrder?.tailNumber || '', Validators.required],
      title: [workOrder?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [workOrder?.description || ''],
      priority: [workOrder?.priority || 'LOW', Validators.required],
      status: [workOrder?.status || 'Draft', Validators.required]
    });
  }

  loadAircraft(): void {
    this.aircraftService.getAircraft().subscribe({
      next: (aircraft) => {
        this.aircraft = aircraft;
      },
      error: (err) => {
        console.error('Failed to load aircraft', err);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.form.value;

    if (this.isEditMode && this.data.workOrder) {
      // Update existing work order
      this.workOrdersService.updateWorkOrder(this.data.workOrder.id, formValue).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.errorMessage = 'Failed to update work order';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      // Create new work order
      this.workOrdersService.createWorkOrder(formValue).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.errorMessage = 'Failed to create work order';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `${fieldName} must be at least ${minLength} characters`;
    }
    
    return '';
  }
}
