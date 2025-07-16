import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http:HttpService) { }

  async fetchVehicleList(): Promise<any> {
    try {
      const response = await this.http.get<any>('VehicleList');
      return response.data; // Assuming the response contains a 'data' field with the vehicles
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  }
}
