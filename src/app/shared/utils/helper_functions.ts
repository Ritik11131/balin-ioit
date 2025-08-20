const priorityMap: Record<string, number> = {
  running: 1,
  dormant: 2,
  stop: 3,
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

export const pathReplayConvertedValidJson = (data:any) => {
    const trackPath = data?.map((obj:any)=>{
      return { lat:obj.latitude, lng:obj.longitude, speed:obj?.speed, timestamp:obj?.timestamp, heading:obj?.heading,details:obj?.details  }
    })    
    
    // Find the first unique point
    const firstUniqueIndex = trackPath.findIndex((point:any, index:any) =>
        point.lat !== trackPath[0].lat || point.lng !== trackPath[0].lng
    );

    // Slice the array from the first unique point (including the first unique)
    return firstUniqueIndex > 0 ? trackPath.slice(firstUniqueIndex - 1) : trackPath;
  }
