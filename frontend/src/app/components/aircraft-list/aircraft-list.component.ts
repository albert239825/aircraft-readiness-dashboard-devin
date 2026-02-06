import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Aircraft } from '../../models';
import { AircraftService } from '../../services/aircraft.service';
import { AircraftDetailComponent } from '../aircraft-detail/aircraft-detail.component';

@Component({
  selector: 'app-aircraft-list',
  templateUrl: './aircraft-list.component.html',
  styleUrls: ['./aircraft-list.component.scss']
})
export class AircraftListComponent implements OnInit {
  displayedColumns: string[] = ['tailNumber', 'aircraftType', 'base', 'status', 'nextInspectionDate'];
  dataSource = new MatTableDataSource<Aircraft>([]);
  isLoading = true;
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private aircraftService: AircraftService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadAircraft();
  }

  loadAircraft(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.aircraftService.getAircraft().subscribe({
      next: (aircraft) => {
        this.dataSource.data = aircraft;
        // Set paginator and sort after data is loaded
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load aircraft data';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  ngAfterViewInit(): void {
    // Set paginator and sort initially
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Reload to ensure they're connected
    if (this.dataSource.data.length === 0) {
      this.loadAircraft();
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowClick(aircraft: Aircraft): void {
    this.dialog.open(AircraftDetailComponent, {
      width: '600px',
      data: { tailNumber: aircraft.tailNumber }
    });
  }

  getStatusClass(status: string): string {
    return status === 'MISSION CAPABLE' ? 'status-capable' : 'status-not-capable';
  }
}
