import { Rule } from "antd/es/form";

export const validateEmail: Rule[] = [
  { required: true, message: "Please input your email!" },
  {
    type: "email",
    message: "Please input a valid email address!",
  },
];

export const validatePassword: Rule[] = [
  { required: true, message: "Please input your password!" },
  {
    min: 6,
    message: "Password must be at least 6 characters long!",
  },
];

export const validateConfirmPassword: Rule[] = [
  { required: true, message: "Please confirm your password!" },
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match!"));
    },
  }),
];
export const validateName: Rule[] = [
  { required: true, message: "Please input your name!" },
  {
    pattern: /^[a-zA-Z\s]+$/,
    message: "Your name can only contain letters and spaces!",
  },
];
