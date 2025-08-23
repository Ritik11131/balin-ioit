import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private cache = new Map<string, string>();

  constructor(private http: HttpService) {}

  async getAddress(lat: number, lng: number): Promise<string> {
    const key = `${lat.toFixed(5)},${lng.toFixed(5)}`; // rounded for caching
    
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    try {
      // Example API — replace with your backend / Google / Nominatim endpoint
      const res: any = await this.http.get(`Geocoding/${lat}/${lng}`)

      const address = res?.data ?? 'Address not found';
      this.cache.set(key, address);
      return address;
    } catch (err) {
      console.error('Error fetching address:', err);
      return 'Address not found';
    }
  }
}
