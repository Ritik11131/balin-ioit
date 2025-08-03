export interface ConfigActions {
  cctv: boolean;
  dashCam: boolean;
  parking: boolean;
  bootLock: boolean;
  elocking: boolean;
  security: boolean;
  wheelLock: boolean;
  padlocking?: boolean; // Only in webConfig
  immobilizer: boolean;
  perWheelLock: boolean;
  setOverSpeed: boolean;
  trackingLink: boolean;
  historyReplay: boolean;
  navigateToGoogle: boolean;
}

export interface ConfigModules {
  bms: boolean;
  eta: boolean;
  replay: boolean;
  rawData: boolean;
  geofence: boolean;
  devicelist: boolean;
  suscription?: boolean; // webConfig (typo in API)
  subscription?: boolean; // androidConfig
  notification: boolean;
  landingPageDashBoard?: boolean; // Only in androidConfig
}

export interface ConfigOptions {
  ac: boolean;
  gps: boolean;
  door: boolean;
  power: boolean;
  speed: boolean;
  bmsSOC: boolean;
  parking: boolean;
  elocking?: boolean; // Only in webConfig
  humidity: boolean;
  odometer: boolean;
  security: boolean;
  todayKms: boolean;
  wheelLock: boolean;
  extBattery: boolean;
  intBattery: boolean;
  immobilizer: boolean;
  temperature: boolean;
}

export interface ConfigReports {
  acReport: boolean;
  bmsReport: boolean;
  socReport: boolean;
  idleReport: boolean;
  lockReport: boolean;
  stopReport: boolean;
  tripReport: boolean;
  alertReport: boolean;
  detailReport: boolean;
  distanceReport: boolean;
  geofenceReport: boolean;
  positionReport: boolean;
  overspeedReport: boolean;
  socVsVoltReport: boolean;
  temperatureReport: boolean;
  totalDistanceReport: boolean;
}

export interface ConfigPermissions {
  deleteUser: boolean;
  showLatlng: boolean;
  createDealer: boolean;
  deleteDevice: boolean;
  installationDate: boolean;
  markerClustering: boolean;
  passwordProtecttion: boolean; // Note: typo in API response
  landingPageDashBoard?: boolean; // Only in webConfig
}

export interface ConfigTableColumns {
  ignition: boolean;
  timestamp: boolean;
  vehicleNo: boolean;
  deviceImei: boolean;
  immobilizer: boolean;
  batteryVoltage: boolean;
  installationOn: boolean;
}

export interface ConfigNotifications {
  sos: boolean;
  acOn: boolean;
  door: boolean;
  lock: boolean;
  acOff: boolean;
  alarm: boolean;
  secOn: boolean;
  secOff: boolean;
  unlock: boolean;
  jamming: boolean;
  parking: boolean;
  doorOpen: boolean;
  lowPower: boolean;
  pirAlert: boolean;
  powerCut: boolean;
  powerOff: boolean;
  removing: boolean;
  bootAlert: boolean;
  doorClose: boolean;
  tampering: boolean;
  wheelLock: boolean;
  ignitionOn: boolean;
  lowBattery: boolean;
  nightDrive: boolean;
  hardBraking: boolean;
  ignitionOff: boolean;
  wheelUnLock: boolean;
  geofenceExit: boolean;
  overSpeedEnd: boolean;
  commandResult: boolean;
  deviceUnknown: boolean;
  geofenceEnter: boolean;
  hardCornering: boolean;
  powerRestored: boolean;
  overSpeedStart: boolean;
  continuousDrive: boolean;
  deviceOverspeed: boolean;
  hardAcceleration: boolean;
}

export interface PlatformConfig {
  actions: ConfigActions;
  modules: ConfigModules;
  options: ConfigOptions;
  reports: ConfigReports;
  permissions: ConfigPermissions;
  tableColumns: ConfigTableColumns;
  notifications: ConfigNotifications;
}

export interface UserConfigurationAttributes {
  webConfig: PlatformConfig;
  androidConfig: PlatformConfig;
}

export interface UserConfiguration {
  id: number;
  attributes: UserConfigurationAttributes;
  fkUserId: number;
  userName: string;
  loginId: string;
}

export interface UserConfigurationApiResponse {
  result: boolean;
  data: UserConfiguration;
}

export interface UserConfigurationState {
  configuration: UserConfiguration | null;
  loading: boolean;
  error: string | null;
  loaded: boolean;
}

export const initialUserConfigurationState: UserConfigurationState = {
  configuration: null,
  loading: false,
  error: null,
  loaded: false
};