import { DatePipe } from '@angular/common';

export function generateQueryString(params: { [key: string]: any }): string {
  const queryParams = new URLSearchParams();

  // Iterate over the object keys and add non-null, non-undefined values
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value);
    }
  });

  // Return the query string
  return '?' + queryParams.toString();
}

export function formatTimestamp(timestamp: string | null): string {
  if (!timestamp) return 'NA';

  const datePipe = new DatePipe('en-US'); // Create a new DatePipe instance
  return datePipe.transform(timestamp, 'dd/MM/yyyy HH:mm') ?? 'NA';
}

export function formatDate(timestamp: string | null): string {
  if (!timestamp) return 'NA';

  const datePipe = new DatePipe('en-US'); // Create a new DatePipe instance
  return datePipe.transform(timestamp, 'dd/MM/yyyy') ?? 'NA';
}
