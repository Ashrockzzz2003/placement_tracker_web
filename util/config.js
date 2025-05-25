// List of departements
const departements = [
    "CSE", // Computer Science and Engineering
    "AIE", // Artificial Intelligence and Data Engineering
    "AID", // Artificial Intelligence and Data Science
    "MEE", // Mechanical Engineering
    "ECE", // Electronics and Communication Engineering
    "EEE", // Electrical and Electronics Engineering
    "RAI", // Robotics and Artificial Intelligence
    "EAC", // Electronics and Computer Engineering
    "ELC"  // Electrical and Computer Engineering
];

// List of schools
const schools = [
    "EN", // School of Engineering
    "SC"  // School of Computing
];

// List of campuses
const campuses = [
    "CB", // Coimbatore
    "BL"  // Bangalore
];

const campusNames = {
    CB: "Coimbatore",
    BL: "Bangalore"
};

// Sub Regex's
const departementsRegexMatch = departements.join("|");
const schoolRegexMatch = schools.join("|");
const campusRegexMatch = campuses.join("|");
//Main Regex's
const emailRegex = new RegExp(`^[a-zA-Z0-9+_.-]+@(?:${campusRegexMatch}).students.amrita.edu$`, "i");
//Valid: test.test@cb.students.amrita.edu, test@bl.students.amrita.edu | Invalid: test@students.amrita.edu, test.test@gmail.com

const rollNoRegex = new RegExp(`^(?:${campusRegexMatch}).(?:${schoolRegexMatch}).U4(?:${departementsRegexMatch})[0-9]{5}$`);
//Valid: CB.EN.U4CSE20001, BL.SC.U4AIE20002 | Invalid: cb.en.U4cse20001, CB.En.U4CSE20001

//beware of case sensitivity while implementing regex

export { 
    departements, 
    schools, 
    campuses,
    campusNames,
    departementsRegexMatch, 
    schoolRegexMatch, 
    campusRegexMatch, 
    emailRegex, 
    rollNoRegex 
};