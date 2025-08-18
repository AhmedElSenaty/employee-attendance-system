// Demo data for the application
export interface DemoEmployee {
  id: number;
  name: string;
  department: string;
  subDepartment: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export interface DemoDevice {
  id: number;
  name: string;
  ip: string;
  port: number;
  location?: string;
  status?: "online" | "offline" | "maintenance";
  lastSeen?: string;
}

// Static employee data for demonstration
export const DEMO_EMPLOYEES: DemoEmployee[] = [
  {
    id: 1,
    name: "Ahmed Mohamed Hassan",
    department: "IT Department",
    subDepartment: "Development",
    email: "ahmed.mohamed@company.com",
    phoneNumber: "+201234567890",
    isActive: true,
  },
  {
    id: 2,
    name: "Fatima Ali Abdel-Rahman",
    department: "HR Department",
    subDepartment: "Recruitment",
    email: "fatima.ali@company.com",
    phoneNumber: "+201234567891",
    isActive: true,
  },
  {
    id: 3,
    name: "Omar Hassan Ibrahim",
    department: "Finance Department",
    subDepartment: "Accounting",
    email: "omar.hassan@company.com",
    phoneNumber: "+201234567892",
    isActive: true,
  },
  {
    id: 4,
    name: "Aisha Khalil Mahmoud",
    department: "IT Department",
    subDepartment: "Support",
    email: "aisha.khalil@company.com",
    phoneNumber: "+201234567893",
    isActive: true,
  },
  {
    id: 5,
    name: "Mohamed Ibrahim Saleh",
    department: "Marketing Department",
    subDepartment: "Digital Marketing",
    email: "mohamed.ibrahim@company.com",
    phoneNumber: "+201234567894",
    isActive: true,
  },
  {
    id: 6,
    name: "Nour El-Din Ahmed",
    department: "Operations Department",
    subDepartment: "Logistics",
    email: "nour.eldin@company.com",
    phoneNumber: "+201234567895",
    isActive: true,
  },
  {
    id: 7,
    name: "Hana Mahmoud Ali",
    department: "Sales Department",
    subDepartment: "B2B Sales",
    email: "hana.mahmoud@company.com",
    phoneNumber: "+201234567896",
    isActive: true,
  },
  {
    id: 8,
    name: "Karim Abdel-Rahman",
    department: "IT Department",
    subDepartment: "Infrastructure",
    email: "karim.abdel@company.com",
    phoneNumber: "+201234567897",
    isActive: true,
  },
  {
    id: 9,
    name: "Layla Ahmed Hassan",
    department: "Customer Service",
    subDepartment: "Support",
    email: "layla.ahmed@company.com",
    phoneNumber: "+201234567898",
    isActive: true,
  },
  {
    id: 10,
    name: "Youssef Mohamed Ali",
    department: "Quality Assurance",
    subDepartment: "Testing",
    email: "youssef.mohamed@company.com",
    phoneNumber: "+201234567899",
    isActive: true,
  },
  {
    id: 11,
    name: "Mariam Hassan Ibrahim",
    department: "Legal Department",
    subDepartment: "Contracts",
    email: "mariam.hassan@company.com",
    phoneNumber: "+201234567800",
    isActive: true,
  },
  {
    id: 12,
    name: "Amr Khalil Abdel-Rahman",
    department: "Research & Development",
    subDepartment: "Innovation",
    email: "amr.khalil@company.com",
    phoneNumber: "+201234567801",
    isActive: true,
  },
];

// Static device data for demonstration
export const DEMO_DEVICES: DemoDevice[] = [
  {
    id: 1,
    name: "Main Entrance Device",
    ip: "192.168.1.100",
    port: 4350,
    location: "Main Building - Ground Floor",
    status: "online",
    lastSeen: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Back Office Device",
    ip: "192.168.1.101",
    port: 4350,
    location: "Main Building - 1st Floor",
    status: "online",
    lastSeen: "2024-01-15T10:25:00Z",
  },
  {
    id: 3,
    name: "Warehouse Device",
    ip: "192.168.1.102",
    port: 4350,
    location: "Warehouse Building",
    status: "online",
    lastSeen: "2024-01-15T10:20:00Z",
  },
  {
    id: 4,
    name: "Parking Device",
    ip: "192.168.1.103",
    port: 4350,
    location: "Parking Area",
    status: "online",
    lastSeen: "2024-01-15T10:15:00Z",
  },
  {
    id: 5,
    name: "Cafeteria Device",
    ip: "192.168.1.104",
    port: 4350,
    location: "Cafeteria Building",
    status: "online",
    lastSeen: "2024-01-15T10:10:00Z",
  },
  {
    id: 6,
    name: "Security Gate Device",
    ip: "192.168.1.105",
    port: 4350,
    location: "Security Gate",
    status: "online",
    lastSeen: "2024-01-15T10:05:00Z",
  },
  {
    id: 7,
    name: "Production Floor Device",
    ip: "192.168.1.106",
    port: 4350,
    location: "Production Building - Floor 1",
    status: "online",
    lastSeen: "2024-01-15T10:00:00Z",
  },
  {
    id: 8,
    name: "Research Lab Device",
    ip: "192.168.1.107",
    port: 4350,
    location: "Research Building - Lab 1",
    status: "online",
    lastSeen: "2024-01-15T09:55:00Z",
  },
  {
    id: 9,
    name: "Conference Room Device",
    ip: "192.168.1.108",
    port: 4350,
    location: "Main Building - Conference Room",
    status: "online",
    lastSeen: "2024-01-15T09:50:00Z",
  },
  {
    id: 10,
    name: "Training Center Device",
    ip: "192.168.1.109",
    port: 4350,
    location: "Training Center",
    status: "online",
    lastSeen: "2024-01-15T09:45:00Z",
  },
];
