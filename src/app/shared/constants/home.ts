export const VEHICLE_OVERVIEW_FIELDS = [
  {
    label: 'Updated',
    value: (v: any) => v?.lastUpdated ? `${v.lastUpdated}` : null,
    pipe: 'timeAgo' // special pipe handling
  },
  {
    label: 'Odometer',
    value: (v: any) =>
      ((v?.apiObject?.device?.details?.lastOdometer || 0) / 1000).toFixed(3)
  },
  {
    label: 'Address',
    value: (v: any) => v?.location || '-',
    colSpan: 2
  },
  {
    label: 'Battery (Int / Ext)',
    value: () => '0.00 / 0.00'
  },
    {
    label: 'Battery (Int / Ext)',
    value: () => '0.00 / 0.00'
  },
    {
    label: 'Battery (Int / Ext)',
    value: () => '0.00 / 0.00'
  },
    {
    label: 'Battery (Int / Ext)',
    value: () => '0.00 / 0.00'
  },
    {
    label: 'Battery (Int / Ext)',
    value: () => '0.00 / 0.00'
  },
    {
    label: 'Battery (Int / Ext)',
    value: () => '0.00 / 0.00'
  },
];
