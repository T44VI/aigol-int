export type Address = {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  countryCode: string;
};

export type Shipment = {
  id?: string;
  origin: Address;
  destination: Address;
  packages: Package[];
  productCode: string;
};

export type Package = {
  id: string;
  weight: number; // in kilograms
  dimensions: Dimensions;
};

export type Dimensions = {
  length: number; // in centimeters
  width: number; // in centimeters
  height: number; // in centimeters
};

export type ShipmentRequest = Omit<Shipment, "productCode">;

export type ShipmentResponse = Shipment & {
  trackingNumber: string;
};
