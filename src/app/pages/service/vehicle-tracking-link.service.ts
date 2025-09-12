import { Injectable } from '@angular/core';
import { TRACKIN_LINK_FORM_FIELDS } from '../../shared/constants/forms';

@Injectable({ providedIn: 'root' })
export class VehicleTrackingLinkService {
  trackingHours: number = 24;
  generatedLink: string = '';
  isGenerating: boolean = false;
  formFields = TRACKIN_LINK_FORM_FIELDS ;

  /**
   * Validate the tracking hours input between 1 and 168.
   */
  validateTrackingHours(hours: number): boolean {
    return hours >= 1 && hours <= 10;
  }

  /**
   * Generate the tracking link asynchronously (simulate API call).
   */
  async generateTrackingLink(vehicleId: string, hours: number): Promise<string> {
    if (!this.validateTrackingHours(hours))
      throw new Error('Invalid tracking hours');

    this.isGenerating = true;
    try {
      await this.delay(2000); // Simulate network delay
      const timestamp = new Date().getTime();
      const token = this.generateRandomToken();
      this.generatedLink = `https://track.yourapp.com/live/${vehicleId}/${token}?duration=${hours}h&expires=${timestamp}`;
      return this.generatedLink;
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
      this.showNotification('Link copied to clipboard!', 'success');
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
        this.showNotification('Link shared successfully!', 'success');
      } else {
        await this.copyLink(link);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') this.showNotification('Failed to share link', 'error');
    }
  }

  /**
   * Generate a random token string.
   */
  private generateRandomToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Delay helper.
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
      this.showNotification(successful ? 'Link copied to clipboard!' : 'Failed to copy link', successful ? 'success' : 'error');
    } catch {
      this.showNotification('Failed to copy link', 'error');
    }
    document.body.removeChild(textArea);
  }

  /**
   * Notification placeholder (replace with your notif service).
   */
  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    console.log(`${type.toUpperCase()}: ${message}`);
  }

  /**
   * Reset state.
   */
  reset(): void {
    this.trackingHours = 24;
    this.generatedLink = '';
    this.isGenerating = false;
  }
}
