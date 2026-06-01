// Dummy data for the Super Admin Dashboard

export type HospitalStatus = "Active" | "Trial" | "Expired" | "Suspended";
export type PackageTier = "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE";

export interface Hospital {
  id: string;
  name: string;
  plan: PackageTier;
  status: HospitalStatus;
  doctors: number;
  patients: number;
  storageGb: number;
  branches: number;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  createdAt: string;
}

export const hospitals: Hospital[] = [
  { id: "h1", name: "ABC Hospital", plan: "PREMIUM", status: "Active", doctors: 12, patients: 4200, storageGb: 45, branches: 2, city: "Mumbai", state: "MH", address: "12 Marine Drive", phone: "+91 98200 11111", email: "admin@abchospital.in", contactPerson: "Dr. R. Mehta", createdAt: "2024-03-12" },
  { id: "h2", name: "Sunrise Care Center", plan: "BASIC", status: "Active", doctors: 6, patients: 1800, storageGb: 18, branches: 1, city: "Pune", state: "MH", address: "44 FC Road", phone: "+91 98201 22222", email: "ops@sunrisecare.in", contactPerson: "S. Iyer", createdAt: "2024-07-02" },
  { id: "h3", name: "Greenfield Multispeciality", plan: "ENTERPRISE", status: "Active", doctors: 48, patients: 22000, storageGb: 280, branches: 5, city: "Bengaluru", state: "KA", address: "100 MG Road", phone: "+91 98202 33333", email: "it@greenfield.in", contactPerson: "K. Raj", createdAt: "2023-11-20" },
  { id: "h4", name: "Lotus Clinic", plan: "FREE", status: "Trial", doctors: 2, patients: 140, storageGb: 1, branches: 1, city: "Jaipur", state: "RJ", address: "5 Civil Lines", phone: "+91 98203 44444", email: "hello@lotusclinic.in", contactPerson: "P. Singh", createdAt: "2025-05-08" },
  { id: "h5", name: "Harmony Wellness", plan: "BASIC", status: "Trial", doctors: 4, patients: 560, storageGb: 6, branches: 1, city: "Hyderabad", state: "TS", address: "22 Banjara Hills", phone: "+91 98204 55555", email: "info@harmonywell.in", contactPerson: "A. Reddy", createdAt: "2025-05-21" },
  { id: "h6", name: "Riverline Hospital", plan: "PREMIUM", status: "Expired", doctors: 14, patients: 6800, storageGb: 88, branches: 3, city: "Kolkata", state: "WB", address: "9 Park Street", phone: "+91 98205 66666", email: "admin@riverline.in", contactPerson: "D. Bose", createdAt: "2023-02-14" },
  { id: "h7", name: "Oakridge Medical", plan: "PREMIUM", status: "Active", doctors: 22, patients: 9500, storageGb: 120, branches: 4, city: "Delhi", state: "DL", address: "B-12 Saket", phone: "+91 98206 77777", email: "support@oakridge.in", contactPerson: "M. Khan", createdAt: "2024-01-30" },
  { id: "h8", name: "Cura Family Health", plan: "BASIC", status: "Suspended", doctors: 3, patients: 320, storageGb: 4, branches: 1, city: "Chennai", state: "TN", address: "18 T Nagar", phone: "+91 98207 88888", email: "admin@curahealth.in", contactPerson: "L. Pillai", createdAt: "2024-09-11" },
];

export interface PackageDef {
  id: string;
  tier: PackageTier;
  monthly: number;
  yearly: number;
  maxDoctors: number;
  maxStorageGb: number;
  maxBranches: number;
  features: { name: string; enabled: boolean }[];
  activeHospitals: number;
  popular?: boolean;
}

export const packages: PackageDef[] = [
  { id: "p1", tier: "FREE", monthly: 0, yearly: 0, maxDoctors: 3, maxStorageGb: 2, maxBranches: 1, activeHospitals: 1,
    features: [
      { name: "Patient Management", enabled: true },
      { name: "Appointments", enabled: true },
      { name: "Prescription", enabled: false },
      { name: "Billing", enabled: false },
      { name: "Lab Reports", enabled: false },
      { name: "Pharmacy", enabled: false },
      { name: "Patient Portal", enabled: false },
    ] },
  { id: "p2", tier: "BASIC", monthly: 2999, yearly: 29990, maxDoctors: 10, maxStorageGb: 25, maxBranches: 2, activeHospitals: 3,
    features: [
      { name: "Patient Management", enabled: true },
      { name: "Appointments", enabled: true },
      { name: "Prescription", enabled: true },
      { name: "Billing", enabled: true },
      { name: "Lab Reports", enabled: false },
      { name: "Pharmacy", enabled: false },
      { name: "Patient Portal", enabled: false },
    ] },
  { id: "p3", tier: "PREMIUM", monthly: 7999, yearly: 79990, maxDoctors: 25, maxStorageGb: 150, maxBranches: 5, activeHospitals: 12, popular: true,
    features: [
      { name: "Patient Management", enabled: true },
      { name: "Appointments", enabled: true },
      { name: "Prescription", enabled: true },
      { name: "Billing", enabled: true },
      { name: "Lab Reports", enabled: true },
      { name: "Pharmacy", enabled: true },
      { name: "Patient Portal", enabled: false },
    ] },
  { id: "p4", tier: "ENTERPRISE", monthly: 19999, yearly: 199990, maxDoctors: 100, maxStorageGb: 1024, maxBranches: 20, activeHospitals: 4,
    features: [
      { name: "Patient Management", enabled: true },
      { name: "Appointments", enabled: true },
      { name: "Prescription", enabled: true },
      { name: "Billing", enabled: true },
      { name: "Lab Reports", enabled: true },
      { name: "Pharmacy", enabled: true },
      { name: "Patient Portal", enabled: true },
    ] },
];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  hospital: string;
  role: "Hospital Admin" | "Support Staff" | "Super Admin";
  status: "Active" | "Disabled";
  lastLogin: string;
  twoFA: boolean;
}

export const users: AdminUser[] = [
  { id: "u1", name: "Dr. R. Mehta", email: "r.mehta@abchospital.in", hospital: "ABC Hospital", role: "Hospital Admin", status: "Active", lastLogin: "2026-05-30 14:21", twoFA: true },
  { id: "u2", name: "S. Iyer", email: "s.iyer@sunrisecare.in", hospital: "Sunrise Care", role: "Hospital Admin", status: "Active", lastLogin: "2026-05-31 09:02", twoFA: false },
  { id: "u3", name: "K. Raj", email: "k.raj@greenfield.in", hospital: "Greenfield", role: "Hospital Admin", status: "Active", lastLogin: "2026-06-01 08:11", twoFA: true },
  { id: "u4", name: "P. Singh", email: "p.singh@lotusclinic.in", hospital: "Lotus Clinic", role: "Hospital Admin", status: "Active", lastLogin: "2026-05-28 18:45", twoFA: false },
  { id: "u5", name: "L. Pillai", email: "l.pillai@curahealth.in", hospital: "Cura Health", role: "Hospital Admin", status: "Disabled", lastLogin: "2026-04-12 11:30", twoFA: false },
  { id: "u6", name: "Nina Sharma", email: "nina@hospitalsaas.io", hospital: "—", role: "Support Staff", status: "Active", lastLogin: "2026-06-01 07:55", twoFA: true },
  { id: "u7", name: "Aman Verma", email: "aman@hospitalsaas.io", hospital: "—", role: "Support Staff", status: "Active", lastLogin: "2026-05-31 22:10", twoFA: true },
  { id: "u8", name: "Priya Nair", email: "priya@hospitalsaas.io", hospital: "—", role: "Support Staff", status: "Disabled", lastLogin: "2026-03-19 10:02", twoFA: false },
  { id: "u9", name: "Ravi Kapoor", email: "ravi@hospitalsaas.io", hospital: "—", role: "Super Admin", status: "Active", lastLogin: "2026-06-01 08:30", twoFA: true },
  { id: "u10", name: "Maya Founder", email: "maya@hospitalsaas.io", hospital: "—", role: "Super Admin", status: "Active", lastLogin: "2026-06-01 08:00", twoFA: true },
];

export type AuditAction = "create" | "update" | "delete" | "login" | "suspend";
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  type: AuditAction;
  target: string;
  details: string;
}

export const auditLogs: AuditLog[] = [
  { id: "a1", timestamp: "2026-06-01 08:30", user: "Ravi Kapoor", action: "Admin Login", type: "login", target: "Super Admin Portal", details: "2FA verified" },
  { id: "a2", timestamp: "2026-06-01 08:11", user: "K. Raj", action: "Package Changed", type: "update", target: "Greenfield Multispeciality", details: "PREMIUM → ENTERPRISE" },
  { id: "a3", timestamp: "2026-05-31 22:10", user: "Aman Verma", action: "Hospital Created", type: "create", target: "Harmony Wellness", details: "Trial assigned" },
  { id: "a4", timestamp: "2026-05-31 18:02", user: "Maya Founder", action: "Package Updated", type: "update", target: "PREMIUM Plan", details: "Pharmacy feature enabled" },
  { id: "a5", timestamp: "2026-05-31 14:48", user: "Nina Sharma", action: "Hospital Suspended", type: "suspend", target: "Cura Family Health", details: "Payment overdue 30d" },
  { id: "a6", timestamp: "2026-05-30 14:21", user: "Dr. R. Mehta", action: "Admin Login", type: "login", target: "ABC Hospital", details: "Web client" },
  { id: "a7", timestamp: "2026-05-30 11:05", user: "Ravi Kapoor", action: "User Disabled", type: "delete", target: "L. Pillai", details: "Account flagged" },
  { id: "a8", timestamp: "2026-05-29 16:40", user: "Aman Verma", action: "Hospital Created", type: "create", target: "Lotus Clinic", details: "FREE plan trial" },
  { id: "a9", timestamp: "2026-05-29 10:12", user: "Maya Founder", action: "Package Created", type: "create", target: "ENTERPRISE+", details: "Draft saved" },
  { id: "a10", timestamp: "2026-05-28 18:45", user: "P. Singh", action: "Admin Login", type: "login", target: "Lotus Clinic", details: "Mobile" },
  { id: "a11", timestamp: "2026-05-28 09:00", user: "Nina Sharma", action: "Password Reset", type: "update", target: "S. Iyer", details: "Reset link sent" },
  { id: "a12", timestamp: "2026-05-27 19:30", user: "Ravi Kapoor", action: "Hospital Suspended", type: "suspend", target: "Riverline Hospital", details: "Trial expired" },
  { id: "a13", timestamp: "2026-05-27 12:14", user: "K. Raj", action: "Branch Added", type: "create", target: "Greenfield — Whitefield", details: "Branch #5" },
  { id: "a14", timestamp: "2026-05-26 08:22", user: "Maya Founder", action: "Audit Export", type: "update", target: "Logs CSV", details: "Last 30 days" },
  { id: "a15", timestamp: "2026-05-25 15:00", user: "Aman Verma", action: "Hospital Updated", type: "update", target: "Oakridge Medical", details: "Contact info changed" },
];

export const revenueTrend = [
  { m: "Dec", v: 92 }, { m: "Jan", v: 105 }, { m: "Feb", v: 98 },
  { m: "Mar", v: 118 }, { m: "Apr", v: 126 }, { m: "May", v: 138 }, { m: "Jun", v: 145 },
];

export const subscriptionHistory = [
  { id: "s1", date: "2025-12-01", action: "Plan Upgraded", from: "BASIC", to: "PREMIUM", amount: 79990, by: "Dr. R. Mehta" },
  { id: "s2", date: "2025-06-01", action: "Renewed", from: "BASIC", to: "BASIC", amount: 29990, by: "Dr. R. Mehta" },
  { id: "s3", date: "2024-12-01", action: "Renewed", from: "BASIC", to: "BASIC", amount: 29990, by: "Dr. R. Mehta" },
  { id: "s4", date: "2024-06-01", action: "Started Trial", from: "—", to: "BASIC", amount: 0, by: "System" },
];
