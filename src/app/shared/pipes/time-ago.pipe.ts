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
    const diff = Math.floor((now.getTime() - updatedDate.getTime()) / 1000); // in seconds

    if (diff < 60) return `Updated: ${diff} sec ago`;
    if (diff < 3600) return `Updated: ${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `Updated: ${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
    if (diff < 2592000) return `Updated: ${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
    if (diff < 31536000) return `Updated: ${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) > 1 ? 's' : ''} ago`;

    return `Updated: ${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) > 1 ? 's' : ''} ago`;
  }
}
