const BASE_URL = `${process.env.NEXT_PUBLIC_URL ? process.env.NEXT_PUBLIC_URL : "http://localhost:5000"}/api`;

export const LOGIN_URL = BASE_URL + "/auth/login";
export const REGISTER_URL = BASE_URL + "/auth/studentRegister";
export const STUDENT_REGISTER_VERIFY_URL =
    BASE_URL + "/auth/studentLoginVerify";
export const MANAGER_LOGIN_VERIFY_URL = BASE_URL + "/auth/loginVerify";

export const FORGOT_PASSWORD_URL = BASE_URL + "/auth/forgotPassword";
export const FORGOT_PASSWORD_VERIFY_URL =
    BASE_URL + "/auth/resetPasswordVerify";
export const RESET_PASSWORD_URL = BASE_URL + "/auth/resetPassword";

export const STUDENT_EDIT_PROFILE_URL = BASE_URL + "/student/studentEditData";

export const GET_COMPANY_DATA_URL = BASE_URL + "/manager/getCompanyHireData";
export const GET_TOP_5_PLACEMENTS_URL =
    BASE_URL + "/manager/getTopFivePlacements";
export const GET_COMPANY_LIST_URL = BASE_URL + "/manager/getCompanies";
export const ADD_NEW_COMPANY_URL = BASE_URL + "/manager/addCompany";
export const ADD_NEW_PLACEMENT_URL = BASE_URL + "/manager/addPlacementData";
export const GET_ALL_PLACEMENTS_URL =
    BASE_URL + "/student/getAllPlacedStudentData";
export const GET_ALL_STUDENTS_URL = BASE_URL + "/student/getAllStudentData";
export const REGISTER_OFFICIAL_URL = BASE_URL + "/manager/registerOfficial";
export const GET_REGISTERED_OFFICIALS_URL =
    BASE_URL + "/manager/getRegisteredOfficials";
export const TOGGLE_ACCOUNT_STATUS_URL =
    BASE_URL + "/manager/toggleOfficialStatus";
export const GET_COMPANY_HIRE_DATA_URL =
    BASE_URL + "/manager/getCompanyHireDataById";
export const GET_COMPANY_DATA_BY_BATCH_URL =
    BASE_URL + "/manager/getCompanyHireDataByBatch";
export const ADD_NEW_STUDENT_URL = BASE_URL + "/student/addStudent";

export const GET_STUDENT_PLACEMENTS_URL =
    BASE_URL + "/student/getStudentPlacements";
export const STUDENT_EDIT_PLACEMENT_URL =
    BASE_URL + "/manager/editPlacementDataById";
