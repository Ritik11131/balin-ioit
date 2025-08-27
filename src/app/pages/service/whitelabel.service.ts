import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { UiService } from '../../layout/service/ui.service';

@Injectable({
  providedIn: 'root'
})
export class WhitelabelService {

  constructor(private http: HttpService, private uiService: UiService) { }

  async fetchAllWhiteLabels(): Promise<any> {
    try {
      const response = await this.http.get('SASRegister/all', {});
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
    }
  }

  async createWhiteLabel(data: any): Promise<any> {
    try {
      const response = await this.http.post('SASRegister', data);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
    }
  }

  async updateWhiteLabel(id: any,data: any): Promise<any> {
    try {
      const response = await this.http.put('SASRegister', id, data);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
      
    }
  }

    async deleteWhiteLabel(data: any): Promise<any> {
    try {
      const response = await this.http.delete('SASRegister', data?.id);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
      
    }
  }


    async getWhiteLabelDetailsById(id: any): Promise<any> {
    try {
      const response = await this.http.get('SASRegister/GetById', {}, id);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
    }
  }

async uploadWhiteLabelImages(files: File[]): Promise<any> {
  const formData = new FormData();
  files.forEach(file => formData.append('file', file));

  try {
    const response = await this.http.post('SASRegister/Upload', formData);
    return response;
  } catch (error: any) {
    this.uiService.showToast('error', 'Error', error?.error?.data || 'File upload failed');
    throw error;
  }
}

}
