import { inject, Injectable } from '@angular/core';
import { TRACKIN_LINK_FORM_FIELDS } from '../../shared/constants/forms';
import { UiService } from '../../layout/service/ui.service';
import { HttpService } from './http.service';
import { WhitelabelThemeService } from './whitelabel-theme.service';
import { DELAY_CODE } from '../../shared/utils/helper_functions';

@Injectable({ providedIn: 'root' })
export class VehicleTrackingLinkService {
  private uiService = inject(UiService);
  private http = inject(HttpService);
  private whitelabelThemeService = inject(WhitelabelThemeService)

  trackingHours: number = 24;
  generatedLink: string = '';
  isGenerating: boolean = false;

  formFields = TRACKIN_LINK_FORM_FIELDS ;


   async fetchTrackingToken(data: any): Promise<any> {
    try {
      const response = await this.http.post('ShareUrl', data);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
    }
  }



  /**
   * Validate the tracking hours input between 1 and 168.
   */
  validateTrackingHours(hours: number): boolean {
    return hours >= 1 && hours <= 10;
  }

  /**
   * Generate the tracking link asynchronously (simulate API call).
   */
  async generateTrackingLink(deviceId: string, hours: number): Promise<string> {
    if (!this.validateTrackingHours(hours))
      throw new Error('Invalid tracking hours');

    this.isGenerating = true;
    try {
      await DELAY_CODE(1000);
      const validTill = new Date(Date.now() + hours * 3600000).toISOString().replace('Z', '+05:30');
      const response = await this.fetchTrackingToken({ deviceId, validTill });
      this.generatedLink = `https://${this.whitelabelThemeService.get('url')}/auth${response?.data}`;
      return this.generatedLink;
    } catch(error: any) {
        throw error;
    } finally {
      this.isGenerating = false;
    }
  }

  /**
   * Copy generated link to clipboard with fallback.
   */
  async copyLink(link: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(link);
      this.uiService.showToast('success','Success','Link copied to clipboard!');
    } catch {
      this.fallbackCopyTextToClipboard(link);
    }
  }

  /**
   * Share link using Web Share API or fallback to copy.
   */
  async shareLink(link: string, hours: number): Promise<void> {
    const shareData = {
      title: 'Vehicle Live Tracking',
      text: `Track this vehicle live for ${hours} hours`,
      url: link
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      this.uiService.showToast('success','Success','Link shared successfully!');
      } else {
        await this.copyLink(link);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError')  this.uiService.showToast('error','Error','Failed to shar link!');

    }
  }

  /**
   * Fallback copy method.
   */
  private fallbackCopyTextToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      this.uiService.showToast(successful ? 'success' : 'error',successful ? 'Copied' : 'Error',successful ? 'Link copied to clipboard!' : 'Failed to copy link');
    } catch {
      this.uiService.showToast('error','Error', 'Failed to copy link');
    }
    document.body.removeChild(textArea);
  }

  /**
   * Reset state.
   */
  reset(): void {
    this.trackingHours = 1;
    this.generatedLink = '';
    this.isGenerating = false;
  }
}
