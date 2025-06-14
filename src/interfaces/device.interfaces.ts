export interface IDevice {
  id: number;
  name: string
}
export interface IDeviceCredentials {
  id?: number;
  device_name: string;
  iP_Address: string;
  port: number;
}

export interface IDeviceData {
  id: number;
  device_name: string;
  iP_Address: string;
  port: number;
}