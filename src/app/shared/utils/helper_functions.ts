const priorityMap: Record<string, number> = {
  running: 1,
  stop: 2,
  dormant: 3,
  offline: 4
};

export const sortVehiclesByStatus = (vehicles: any[]): any[] => {
  return [...vehicles].sort((a, b) => {
    const aPriority = priorityMap[a.status?.toLowerCase()] ?? 5;
    const bPriority = priorityMap[b.status?.toLowerCase()] ?? 5;
    return aPriority - bPriority;
  });
};


export const constructVehicleData = (vehicles: any[]): any[] => {
    return vehicles.map(({ device, parking, position, validity }, index) => ({
      id: device?.id,
      name: device?.vehicleNo ,
      lastUpdated: position?.deviceTime,
      location: position?.address || 'Unknown Location',
      status: position?.status?.status.toLowerCase(),
      apiObject: {device,parking,position,validity}
    }));
  }
