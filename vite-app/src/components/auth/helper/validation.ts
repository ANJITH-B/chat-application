import type { TabType, FormDataType, InfoType } from "../types";


export const validateForm = (tab: TabType, formData: FormDataType) => {
  const errors: InfoType[] = [];

  // Email Validation
  if (!formData.email.trim()) {
    errors.push({ msg: "Email is required", type: "error" });
  } else if (
    !formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  ) {
    errors.push({ msg: "Please enter a valid email address", type: "error" });
  }

  // Full Name Validation
  if (tab === "SignUp" && !formData.fullName.trim()) {
    errors.push({ msg: "Full Name is required", type: "error" });
  }

  // Password Validation
  if (!formData.password.trim()) {
    errors.push({ msg: "Password is required", type: "error" });
  } else if (tab === "SignUp" || tab === "LogIn") {
    if (formData.password.length < 6) {
      errors.push({
        msg: "Password must be at least 6 characters long",
        type: "error",
      });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.password.match(strongPasswordRegex)) {
      if (!formData.password.match(/[a-z]/))
        errors.push({
          msg: "Password must contain at least one lowercase letter",
          type: "error",
        });

      if (!formData.password.match(/[A-Z]/))
        errors.push({
          msg: "Password must contain at least one uppercase letter",
          type: "error",
        });

      if (!formData.password.match(/\d/))
        errors.push({
          msg: "Password must contain at least one number",
          type: "error",
        });

      if (!formData.password.match(/[@$!%*?&]/))
        errors.push({
          msg: "Password must contain at least one special character",
          type: "error",
        });
    }
  }

  if (tab === "SignUp" || tab === "ResetPassword") {
    if (!formData.confirmPassword.trim()) {
      errors.push({ msg: "Confirm password is required", type: "error" });
    } else if (formData.password !== formData.confirmPassword) {
      errors.push({ msg: "Passwords do not match", type: "error" });
    }
  }

  return errors;
};
