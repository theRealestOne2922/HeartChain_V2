import { Campaign } from "@/types/campaign";

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Emergency Heart Surgery for Baby Ananya",
    story: "Baby Ananya was born with a congenital heart defect and needs urgent surgery within the next 2 weeks. Her family cannot afford the procedure.",
    imageUrl: "/images/baby-ananya.jpg",
    category: "people",
    subcategory: "surgery",
    goalAmount: 800000,
    raisedAmount: 400000,
    donorCount: 450,
    daysLeft: 12,
    urgencyLevel: "critical",
    isVerified: true,
    beneficiaryName: "The Sharma Family",
    location: "Mumbai, MH",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    hospitalId: "890123", // Apollo
    verificationStatus: 'PENDING',
  },
  {
    id: "2",
    title: "Help Rohan Fight Leukemia",
    story: "16-year-old Rohan was diagnosed with leukemia and needs to travel abroad for specialized treatment not available in his city.",
    imageUrl: "/images/rohan-leukemia.jpg",
    category: "people",
    subcategory: "cancer",
    goalAmount: 4500000,
    raisedAmount: 2250000,
    donorCount: 1200,
    daysLeft: 45,
    urgencyLevel: "high",
    isVerified: true,
    beneficiaryName: "Rohan Kumar",
    location: "Delhi, DL",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-19"),
    hospitalId: "774129", // AIIMS
    verificationStatus: 'PENDING',
  },
  {
    id: "3",
    title: "Kidney Transplant for Vijay",
    story: "Vijay has been on dialysis for 3 years and finally found a matching donor. He needs help covering the transplant costs.",
    imageUrl: "/images/vijay-kidney.jpg",
    category: "people",
    subcategory: "kidney-failure",
    goalAmount: 1200000,
    raisedAmount: 600000,
    donorCount: 350,
    daysLeft: 30,
    urgencyLevel: "high",
    isVerified: true,
    beneficiaryName: "Vijay Patel",
    location: "Ahmedabad, GJ",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-18"),
    hospitalId: "556214", // Mayo
    verificationStatus: 'PENDING',
  },
  {
    id: "4",
    title: "Rebuild After Cyclone Relief",
    story: "Entire communities were devastated by the recent cyclone in Odisha. Help us rebuild homes and provide essential supplies to affected families.",
    imageUrl: "/images/cyclone-relief.jpg",
    category: "causes",
    subcategory: "disaster-relief",
    goalAmount: 5000000,
    raisedAmount: 2500000,
    donorCount: 3100,
    daysLeft: 60,
    urgencyLevel: "critical",
    isVerified: true,
    beneficiaryName: "Coastal Relief Foundation",
    location: "Odisha Coast",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-20"),
    // Non-medical, no hospital
  },
  {
    id: "5",
    title: "Scholarships for Rural Students",
    story: "Provide educational opportunities for 50 brilliant students from rural India who cannot afford college tuition.",
    imageUrl: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800",
    category: "causes",
    subcategory: "education",
    goalAmount: 2500000,
    raisedAmount: 1250000,
    donorCount: 1100,
    daysLeft: 90,
    urgencyLevel: "medium",
    isVerified: true,
    beneficiaryName: "Future Leaders India",
    location: "Pan India",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "6",
    title: "Physical Therapy for Car Accident Survivor",
    story: "After a devastating car accident, Priya needs 6 months of intensive physical therapy to walk again.",
    imageUrl: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800",
    category: "people",
    subcategory: "accident",
    goalAmount: 350000,
    raisedAmount: 175000,
    donorCount: 400,
    daysLeft: 21,
    urgencyLevel: "medium",
    isVerified: true,
    beneficiaryName: "Priya Singh",
    location: "Bangalore, KA",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-19"),
    hospitalId: "890123", // Apollo
    verificationStatus: 'PENDING',
  },
  {
    id: "7",
    title: "Mobile Health Clinic for Tribal Areas",
    story: "Bring healthcare to remote tribal villages with a fully-equipped mobile clinic serving over 10,000 people annually.",
    imageUrl: "/images/tribal-health.jpg",
    category: "causes",
    subcategory: "healthcare-fund",
    goalAmount: 3500000,
    raisedAmount: 1750000,
    donorCount: 1800,
    daysLeft: 120,
    urgencyLevel: "medium",
    isVerified: true,
    beneficiaryName: "Health Without Borders India",
    location: "Jharkhand",
    createdAt: new Date("2023-12-20"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "8",
    title: "Chronic Pain Treatment for Army Veterans",
    story: "Support our brave veterans in accessing specialized chronic pain treatment programs.",
    imageUrl: "/images/veterans.jpg",
    category: "people",
    subcategory: "chronic-illness",
    goalAmount: 1500000,
    raisedAmount: 750000,
    donorCount: 550,
    daysLeft: 35,
    urgencyLevel: "medium",
    isVerified: true,
    beneficiaryName: "Veterans Care Network",
    location: "Pune, MH",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-18"),
    hospitalId: "332156", // Hopkins
    verificationStatus: 'PENDING',
  },
  {
    id: "9",
    title: "Life-Saving Surgery for Grandma Lakshmi",
    story: "After years of caring for her grandchildren, Grandma Lakshmi was diagnosed with a heart condition requiring immediate surgery. The community came together and fully funded her treatment!",
    imageUrl: "/images/grandma-lakshmi.jpg",
    category: "people",
    subcategory: "surgery",
    goalAmount: 500000,
    raisedAmount: 500000,
    donorCount: 1247,
    daysLeft: 0,
    urgencyLevel: "critical",
    isVerified: true,
    beneficiaryName: "Lakshmi Devi",
    location: "Chennai, TN",
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-01-10"),
    hospitalId: "890123", // Apollo
    verificationStatus: 'RELEASED',
    verificationTxHash: '0xabc123...', // Demo hash
  },
  {
    id: "10",
    title: "Young Athlete's Recovery Journey",
    story: "17-year-old Arjun suffered a devastating spinal injury during a cricket match. Thanks to thousands of generous hearts, he received the surgery he needed and is now in recovery!",
    imageUrl: "/images/arjun-athlete.jpg",
    category: "people",
    subcategory: "accident",
    goalAmount: 1800000,
    raisedAmount: 1800000,
    donorCount: 2156,
    daysLeft: 0,
    urgencyLevel: "high",
    isVerified: true,
    beneficiaryName: "Arjun Reddy",
    location: "Hyderabad, TS",
    createdAt: new Date("2023-11-15"),
    updatedAt: new Date("2024-01-05"),
    hospitalId: "774129", // AIIMS
    verificationStatus: 'RELEASED',
    verificationTxHash: '0xdef456...', // Demo hash
  },
];

export const getFeaturedCampaigns = () => {
  return mockCampaigns.filter(c => c.urgencyLevel === 'critical' || c.urgencyLevel === 'high').slice(0, 4);
};

export const getUrgentCampaigns = () => {
  return mockCampaigns.filter(c => c.urgencyLevel === 'critical');
};

export const getCampaignsByCategory = (category: 'people' | 'causes') => {
  return mockCampaigns.filter(c => c.category === category);
};

export const getCompletedCampaigns = () => {
  return mockCampaigns.filter(c => c.raisedAmount >= c.goalAmount);
};

export const getActiveCampaigns = () => {
  return mockCampaigns.filter(c => c.raisedAmount < c.goalAmount);
};
