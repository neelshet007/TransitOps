export interface Vehicle {
  id: string;
  plate_number: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  status: "active" | "inactive" | "maintenance";
}