// Reusable base interface
export interface BaseDevice {
  device_name: string;
  iP_Address: string;
  port: number;
}

// Minimal device representation (e.g., for dropdowns or summaries)
export interface DeviceSummary {
  id: number;
  name: string;
}

// Device credentials input (e.g., form data or creation DTO)
export interface DeviceCredentials extends Partial<BaseDevice> {
  id?: number;
}

// Full device entity from API or DB
export interface Device extends BaseDevice {
  id: number;
}

export interface DisconnectedDevice {
  Time: string;   // e.g., "14:35"
  Date: string;   // e.g., "2025-06-22"
  IP: string;     // e.g., "192.168.0.1"
  Status: string; // e.g., "Disconnected"
}