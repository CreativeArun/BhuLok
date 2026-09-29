export interface PropertyMetadata {
  ulpin: string;
  floorNumber: number;
  unitNumber: number;
  area: number;
  baseZ: number;
  topZ: number;
  height: number;
  buildingId: string | number;
  status: 'VERIFIED' | 'PENDING' | 'DISPUTED';
  ownerName?: string;
}
