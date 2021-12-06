import * as yup from "yup";
import Axios from "axios";

// Schemas for Forms
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please input a valid email")
    .required("email is required"),
  password: yup.string().required("password is required"),
});

export const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please input a valid email")
    .required("email is required"),
});

export const regSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please input a valid email")
    .required("email is required"),
  firstname: yup.string().min(2).max(15).required("This field is required"),
  lastname: yup.string().min(2).max(15).required("This field is required"),
  password: yup
    .string()
    .required("password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*_#?&]{8,}$/,
      "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null]),
  terms: yup
    .bool()
    .oneOf([true], "Accepting our terms and conditions is important to us.")
    .required("kool"),
});

export const passwordResetSchema = yup.object().shape({
  password: yup
    .string()
    .required("password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*_#?&]{8,}$/,
      "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null]),
});

export const profileUpdateSchema = yup.object().shape({
  image: yup.mixed(),
  bank_name: yup.string().min(2).max(50).required("This field is required"),
  bank_account_no: yup
    .string()
    .min(6)
    .max(15)
    .required("This field is required"),
  password: yup.string().required("password is required"),
});

export const cardCategorySchema = yup.object().shape({
  issuer: yup.string().min(2).required("This field is required"),
  currency: yup.string().min(2).required("This field is required"),
  cardType: yup.string().min(2).required("This field is required"),
  rate: yup.number().required("This field is required"),
});
export const categoryEditSchema = yup.object().shape({
  issuer: yup.string().required("required"),
  currency: yup.string(),
  card_type: yup.string(),
  rate: yup.number().required("required"),
});

// refreshToken
export const refreshToken = async () => {
  let token = localStorage.getItem("refresh_token");
  let res = await fetch("/token_refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ access_token: token }),
  });
  let data = await res.json();
  localStorage.setItem("access_token", data.access_token);
};

// Get Data from server
export const getData = async (call, navigate) => {
  let token, data, res;
  token = localStorage.getItem("access_token");
  !token && navigate("/login");
  res = await fetch(call, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (res.status === 401) {
    await refreshToken();
    token = localStorage.getItem("access_token");
    res = await fetch(call, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
    data = await res.json();
    if (res.status === 422) {
      navigate("/login");
    } else {
      return data;
    }
  } else {
    data = await res.json();
    if (res.status === 422) {
      navigate("/login");
    }
    return data;
  }
};

// Image Upload to Cloudinary
export const uploadImage = async (image) => {
  let imageParams = new FormData();
  imageParams.append("file", image[0]);
  imageParams.append("upload_preset", "hasuhajhj");
  let res = await Axios.post(
    "https://api.cloudinary.com/v1_1/wizzle3d/image/upload",
    imageParams
  );
  return res.data.secure_url;
};
