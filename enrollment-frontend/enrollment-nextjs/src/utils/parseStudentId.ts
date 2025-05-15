export interface ParsedStudentId {
  branch: string;
  year: string;
  courseOrSeq: string;
  sectionOrUnique: string;
  isValid: boolean;
  branchName?: string;
}

const branchMap: Record<string, string> = {
  M: "Manila",
  C: "Cebu",
  D: "Davao",
  B: "Batangas",
  L: "Laguna",
  // Add more branches as needed
};

const departmentCodeMap: Record<string, string> = {
  // Junior High School
  "10": "JHS Grade 7",
  "11": "JHS Grade 8",
  "12": "JHS Grade 9",
  "13": "JHS Grade 10",
  
  // Senior High School
  "20": "SHS STEM",
  "21": "SHS HUMSS", 
  "22": "SHS ABM",
  "23": "SHS GAS",
  "24": "SHS TVL",
  
  // College Departments
  "30": "College of Arts and Sciences",
  "31": "College of Business",
  "32": "College of Education",
  "33": "College of Engineering",
  "34": "College of Medicine",
  "35": "College of Nursing",
  // Add more departments as needed
};

export function parseStudentId(id: string): ParsedStudentId {
  if (!id || id === "Unknown") {
    return { branch: "", year: "", courseOrSeq: "", sectionOrUnique: "", isValid: false };
  }

  const match = /^([A-Z])(\d{2})-(\d+)-(\d+)$/.exec(id);
  
  if (!match) {
    return { branch: "", year: "", courseOrSeq: "", sectionOrUnique: "", isValid: false };
  }
  
  const [, branch, year, courseOrSeq, sectionOrUnique] = match;
  const deptCode = courseOrSeq.substring(0, 2);
  
  return {
    branch,
    year: `20${year}`,
    courseOrSeq,
    sectionOrUnique,
    isValid: true,
    branchName: branchMap[branch] || "Unknown Branch",
    departmentName: departmentCodeMap[deptCode] || "Unknown Department"
  };
}
