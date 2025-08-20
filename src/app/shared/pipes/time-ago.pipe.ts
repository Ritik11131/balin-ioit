import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    
    const now = new Date();
    const updatedDate = new Date(value);
    
    // Check if the date is valid
    if (isNaN(updatedDate.getTime())) {
      return 'Updated: Invalid date';
    }
    
    const diff = Math.floor((now.getTime() - updatedDate.getTime()) / 1000); // in seconds
    
    // Handle future dates (negative diff)
    if (diff < 0) {
      const absDiff = Math.abs(diff);
      if (absDiff < 60) return `Updated: in ${absDiff} sec`;
      if (absDiff < 3600) return `Updated: in ${Math.floor(absDiff / 60)} min`;
      if (absDiff < 86400) return `Updated: in ${Math.floor(absDiff / 3600)} hour${Math.floor(absDiff / 3600) > 1 ? 's' : ''}`;
      return `Updated: in the future`;
    }
    
    // Handle very recent updates (0-2 seconds) as "just now"
    if (diff < 3) return 'Updated: just now';
    
    // Handle past dates
    if (diff < 60) return `Updated: ${diff} sec ago`;
    if (diff < 3600) return `Updated: ${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `Updated: ${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
    if (diff < 2592000) return `Updated: ${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
    if (diff < 31536000) return `Updated: ${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) > 1 ? 's' : ''} ago`;
    
    return `Updated: ${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) > 1 ? 's' : ''} ago`;
  }
}