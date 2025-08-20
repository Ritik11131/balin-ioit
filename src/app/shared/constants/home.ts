export const VEHICLE_OVERVIEW_FIELDS = [
  { label: 'Updated', key: 'lastUpdated', pipe: 'timeAgo' },
  { label: 'Address', key: 'address' },
  { label: 'Speed', key: 'speed', suffix: ' km/h' },
  { label: 'Odometer', key: 'details.odometer', suffix: ' km' }
];
