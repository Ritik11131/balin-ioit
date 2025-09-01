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
    label: 'Battery (Int | Ext)(V)',
    value: (v: any) => `${v?.apiObject?.position?.details?.intVolt || '-'} | ${v?.apiObject?.position?.details?.extVolt || '-'} `
  },
  {
    label: 'Power | GPS',
    value: (v: any) => `${v?.apiObject?.position.details.charge === true ? "On" : "Off"} | ${v?.apiObject?.position.valid === 1 ? "Available" : "Not Available"}`
  },
  {
    label: 'Wheel | Immobilizer (Status)',
    value: (v: any) => `${v?.apiObject?.position?.details?.wheelLock ? "Lock" : "Unlock"} | ${v?.apiObject?.position?.details?.armed ? "Immobilised" : "Mobilised"}`
  },
  {
    label: 'SOC | Parking',
    value: (v: any) => `${v?.apiObject?.position?.details?.bmsSOC?.toFixed(3) || '-'} | ${v?.apiObject?.parking === 1 ? "Enabled" : "Disabled"}`
  },
];
