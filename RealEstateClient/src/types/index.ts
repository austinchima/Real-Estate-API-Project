// Real estate property data model
export interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  status: string;
  realtorId: number;
  listedDate: string;
  description: string;
}

// User/client data model
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  createdDate: string;
  isActive: boolean;
}

// Real estate agent data model
export interface Realtor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  agency: string;
  yearsOfExperience: number;
  specialization: string;
  isActive: boolean;
}