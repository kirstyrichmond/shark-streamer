import * as yup from "yup";

export const loginSchema = yup.object().shape({
    email: yup.string().email("Please enter a valid email address").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const registerSchema = yup.object().shape({
    email: yup.string().email("Please enter a valid email address").required("Email is required"),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});