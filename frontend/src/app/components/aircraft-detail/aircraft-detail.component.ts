import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AircraftDetail } from '../../models';
import { AircraftService } from '../../services/aircraft.service';

@Component({
  selector: 'app-aircraft-detail',
  templateUrl: './aircraft-detail.component.html',
  styleUrls: ['./aircraft-detail.component.scss']
})
export class AircraftDetailComponent implements OnInit {
  aircraft: AircraftDetail | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private aircraftService: AircraftService,
    private dialogRef: MatDialogRef<AircraftDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tailNumber: string }
  ) { }

  ngOnInit(): void {
    this.loadAircraftDetail();
  }

  loadAircraftDetail(): void {
    this.aircraftService.getAircraftById(this.data.tailNumber).subscribe({
      next: (aircraft) => {
        this.aircraft = aircraft;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load aircraft details';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  getStatusClass(status: string): string {
    return status === 'MISSION CAPABLE' ? 'status-capable' : 'status-not-capable';
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'priority-high';
      case 'MED': return 'priority-med';
      default: return 'priority-low';
    }
  }
}
