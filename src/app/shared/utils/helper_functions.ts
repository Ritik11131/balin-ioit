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

export const buildHistoryRequests = (vehicleId: number, startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const requests: { fromTime: string; toTime: string; deviceId: number }[] = [];

  if (diffDays > 7) {
    // take only latest date
    const yyyy = end.getFullYear();
    const mm = String(end.getMonth() + 1).padStart(2, '0');
    const dd = String(end.getDate()).padStart(2, '0');

    requests.push({
      deviceId: vehicleId,
      fromTime: `${yyyy}-${mm}-${dd}T00:00:00+05:30`,
      toTime:   `${yyyy}-${mm}-${dd}T23:59:59+05:30`
    });
  } else {
    // build one request per day
    let current = new Date(start);
    while (current <= end) {
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const dd = String(current.getDate()).padStart(2, '0');

      requests.push({
        deviceId: vehicleId,
        fromTime: `${yyyy}-${mm}-${dd}T00:00:00+05:30`,
        toTime:   `${yyyy}-${mm}-${dd}T23:59:59+05:30`
      });

      current.setDate(current.getDate() + 1);
    }
  }

  return requests;
}

