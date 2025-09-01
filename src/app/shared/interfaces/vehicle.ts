export interface VehicleData {
  id: number;
  name: string;
  lastUpdated: string;
  location: string;
  status: string;
  apiObject: {
    device: {
      deviceId: string;
      vehicleNo: string;
      vehicleType: number;
      deviceType: number;
      id: number;
      details: {
        lastOdometer: number;
        lastEngineHours: number;
      };
    };
    parking: any;
    position: {
      status: {
        status: string;
        duration: string;
      };
      protocol: string;
      servertime: string;
      deviceTime: string;
      valid: number;
      latitude: number;
      longitude: number;
      speed: number;
      heading: number;
      altitude: number;
      accuracy: number;
      details: {
        adc: number;
        armed: boolean;
        battPer:number
        bmsSOC: number;
        charge: boolean;
        distance: number;
        door: boolean;
        engHours: number;
        extVolt: number;
        ign: boolean;
        intVolt: number;
        motion: boolean;
        rssi: number;
        sat: number;
        temp: number;
        totalDistance: number;
        vDuration: number;
        vStatus: string;
        versionFw: string;
      };
    };
    validity: {
      installationOn: string;
      nextRechargeDate: string;
      customerRechargeDate: string;
    };
  };
}