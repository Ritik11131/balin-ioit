import moment from "moment";

const priorityMap: Record<string, number> = {
  running: 1,
  dormant: 2,
  stop: 3,
  offline: 4
};

export const tailwindColors500: Record<string, string> = {
  emerald: '#10b981',
  green: '#22c55e',
  lime: '#84cc16',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e'
};

export const TRIAL_PATH_COLORS: Record<string, string> = {
  "running": "#22c55e",
  "stop": "#ef4444",
  "dormant": "#eab308",
};

export const STREAM_PROTOCOLS: Record<string, string> = {
  livetrack24: 'cvpro',
  jt808: 'cvpro',
  cbalin: 'cvpro',
  cbalinlock: 'cvpro',
};

export const EV_VEHICLES = [19]


// Create a reverse map (hex -> name)
export const tailwindColors500Reverse: Record<string, string> = Object.fromEntries(
  Object.entries(tailwindColors500).map(([name, hex]) => [hex.toLowerCase(), name])
);


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
      location: position?.address || 'Tap to view location info',
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


/**
   * Validates stop data structure
   */
  export const isValidStopData = (stop: any): boolean => {
    return stop &&
      typeof stop === 'object' &&
      (stop.Latitude || stop.latitude || stop.Lat) != null &&
      (stop.Longitude || stop.longitude || stop.Lng || stop.Lon) != null;
  }

  /**
   * Extracts coordinates from stop data (handles different property name formats)
   */
  export const extractStopCoordinates = (stop: any): { latitude: number; longitude: number } => {
    const latitude = stop.Latitude || stop.latitude || stop.Lat || 0;
    const longitude = stop.Longitude || stop.longitude || stop.Lng || stop.Lon || 0;

    return {
      latitude: parseFloat(latitude.toString()),
      longitude: parseFloat(longitude.toString())
    };
  }

  /**
   * Validates coordinate values
   */
  export const isValidCoordinate = (lat: number, lng: number): boolean => {
    return !isNaN(lat) && !isNaN(lng) &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180 &&
      !(lat === 0 && lng === 0); // Exclude null island
  }

/**
 * Formats stop duration by calculating difference between start and end times using moment.js
 */
export const formatStopDuration = (stop: any): string => {
  try {
    // Calculate duration from start and end timestamps using moment
    const startTime = stop.dormantStart || stop.DormantStart || stop.startTime || stop.StartTime;
    const endTime = stop.dormantEnd || stop.DormantEnd || stop.endTime || stop.EndTime;

    if (!startTime || !endTime) {
      return 'N/A';
    }

    const startMoment = moment(startTime);
    const endMoment = moment(endTime);

    // Validate moments
    if (!startMoment.isValid() || !endMoment.isValid()) {
      console.warn('Invalid date format in stop data:', { startTime, endTime });
      return 'N/A';
    }

    // Calculate duration using moment
    const duration = moment.duration(endMoment.diff(startMoment));
    const durationMinutes = Math.round(duration.asMinutes());

    // Handle negative duration (end before start)
    if (durationMinutes < 0) {
      console.warn('Negative duration detected:', { start: startTime, end: endTime });
      return 'N/A';
    }

    return formatDurationMinutes(durationMinutes);

  } catch (error) {
    console.error('Error calculating stop duration:', error);
    return 'N/A';
  }
}

/**
 * Helper function to format duration in minutes to readable format
 */
export const formatDurationMinutes = (durationMinutes: number): string => {
  if (durationMinutes < 1) {
    return '<1min';
  } else if (durationMinutes < 60) {
    return `${durationMinutes}min`;
  } else {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}min`;
    }
  }
}

/**
 * Formats stop time from various timestamp formats using moment.js
 */
export const formatStopTime = (timestamp: any): string => {
  if (!timestamp) return 'N/A';
  
  try {
    const momentTime = moment(timestamp);
    
    if (!momentTime.isValid()) {
      console.warn('Invalid timestamp format:', timestamp);
      return timestamp.toString();
    }
    
    return momentTime.format('hh:mm A'); // 12-hour format with AM/PM
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return timestamp.toString();
  }
}

/**
   * Delay helper.
   */
  export const DELAY_CODE = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

