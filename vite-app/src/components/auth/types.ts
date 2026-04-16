export type TabType = "LogIn" | "SignUp" | "OTP" | "ResetPassword";

export type InfoType = {
  msg: string;
  type: "success" | "error" | "warning" | "info";
};

export type FormDataType = {
  email: string;
  password: string;
  fullName: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

export const initialFormData: FormDataType = {
  email: "",
  password: "",
  fullName: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
};