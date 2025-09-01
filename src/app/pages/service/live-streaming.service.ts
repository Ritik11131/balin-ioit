// live-streaming.service.ts
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { STREAM_PROTOCOLS } from '../../shared/utils/helper_functions';

export interface LiveStreamOptions {
  protocol: string;
  uniqueId: string;
  justStream?: boolean;
  themeColor?: string;
  [key: string]: any; // Allow future optional params
}

@Injectable({
  providedIn: 'root'
})
export class LiveStreamingService {

  private baseUrl = environment.liveStreamingBaseUrl;

  constructor(private sanitizer: DomSanitizer) { }

  getStreamingUrl(options: LiveStreamOptions): SafeResourceUrl | null {
    const protocolToUse = STREAM_PROTOCOLS[options.protocol];

    if (!protocolToUse) {
      // console.warn(`Protocol "${options.protocol}" not supported`);
      return null;
    }

    const params = new URLSearchParams();
    params.set('protocol', protocolToUse);
    params.set('uniqueId', options.uniqueId);

    // Add optional params dynamically
    Object.keys(options).forEach(key => {
      if (key !== 'protocol' && key !== 'uniqueId' && options[key] !== undefined) {
        let value = options[key];
        if (key === 'themeColor') value = value.replace('#', '');
        params.set(key, value);
      }
    });

    const url = `${this.baseUrl}?${params.toString()}`;
    console.log(url,'urllll');
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
