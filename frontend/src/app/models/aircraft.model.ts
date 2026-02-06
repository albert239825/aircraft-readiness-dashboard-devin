export interface Aircraft {
  id: number;
  tailNumber: string;
  aircraftType: string;
  base: string;
  status: 'MISSION CAPABLE' | 'NON-MISSION CAPABLE';
  nextInspectionDate: string;
}

export interface AircraftDetail extends Aircraft {
  workOrders: import('./work-order.model').WorkOrder[];
}
