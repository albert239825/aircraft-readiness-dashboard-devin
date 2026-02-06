import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AircraftService } from './aircraft.service';
import { Aircraft, AircraftDetail } from '../models';

describe('AircraftService', () => {
  let service: AircraftService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AircraftService]
    });

    service = TestBed.inject(AircraftService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve aircraft list from API', () => {
    const mockAircraft: Aircraft[] = [
      {
        id: 1,
        tailNumber: 'DEMO-001',
        aircraftType: 'C-17',
        base: 'Travis AFB (demo)',
        status: 'MISSION CAPABLE',
        nextInspectionDate: '2026-02-01'
      },
      {
        id: 2,
        tailNumber: 'DEMO-002',
        aircraftType: 'F-16',
        base: 'Dover AFB (demo)',
        status: 'NON-MISSION CAPABLE',
        nextInspectionDate: '2026-03-15'
      }
    ];

    service.getAircraft().subscribe(aircraft => {
      expect(aircraft).toEqual(mockAircraft);
      expect(aircraft.length).toBe(2);
      expect(aircraft[0].tailNumber).toBe('DEMO-001');
    });

    const req = httpMock.expectOne('/api/aircraft');
    expect(req.request.method).toBe('GET');
    req.flush(mockAircraft);
  });

  it('should handle errors when retrieving aircraft', () => {
    service.getAircraft().subscribe(
      () => fail('should have failed with 500 error'),
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne('/api/aircraft');
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should retrieve aircraft detail by ID', () => {
    const mockDetail: AircraftDetail = {
      id: 1,
      tailNumber: 'DEMO-001',
      aircraftType: 'C-17',
      base: 'Travis AFB (demo)',
      status: 'MISSION CAPABLE',
      nextInspectionDate: '2026-02-01',
      workOrders: [
        {
          id: 100,
          workOrderId: 'WO-0100',
          tailNumber: 'DEMO-001',
          title: 'Inspection Task 1',
          description: 'Test',
          priority: 'HIGH',
          status: 'Draft',
          createdAt: '2026-01-01T00:00:00.000Z'
        }
      ]
    };

    service.getAircraftById('DEMO-001').subscribe(aircraft => {
      expect(aircraft).toEqual(mockDetail);
      expect(aircraft.workOrders.length).toBe(1);
    });

    const req = httpMock.expectOne('/api/aircraft/DEMO-001');
    expect(req.request.method).toBe('GET');
    req.flush(mockDetail);
  });
});
