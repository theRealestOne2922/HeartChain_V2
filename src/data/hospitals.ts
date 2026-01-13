export interface Hospital {
    id: string;
    name: string;
    adminId: string;
    region: string;
}

export const HOSPITALS: Hospital[] = [
    { id: "890123", name: "Apollo Hospitals Mumbai", adminId: "1001", region: "India" },
    { id: "556214", name: "Mayo Clinic", adminId: "1002", region: "USA" },
    { id: "774129", name: "AIIMS Delhi", adminId: "1003", region: "India" },
    { id: "332156", name: "Johns Hopkins Hospital", adminId: "1004", region: "USA" },
    { id: "998412", name: "St. Grace Children's", adminId: "1005", region: "UK" },
];

export const getHospitalById = (id: string) => HOSPITALS.find(h => h.id === id);
