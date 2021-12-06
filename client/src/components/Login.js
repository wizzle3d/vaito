import { useForm } from "react-hook-form";
import { Store } from "../App";
import { useState, useContext } from "react";
import { loginSchema } from "../Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import PasswordRequestForm from "./PasswordRequestForm";
import { useEffect } from "react";

const Login = () => {
  const [display, setDisplay] = useState(0);
  const [serverRes, setServerRes] = useState({});
  const { store, dispatch } = useContext(Store);
  let navigate = useNavigate();

  useEffect(() => {
    if (store.loggedIn) {
      navigate("/");
    }
  }, [store.loggedIn, navigate]);

  //submit to server fuction for when form validates on submit
  const contactServer = async (formData) => {
    const res = await fetch("/login-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.status === 200) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: data,
      });
      navigate(-1, { replace: true });
    } else {
      setServerRes(data);
    }
  };

  // initializing react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  return (
    <>
      <Header />
      {!store.loggedIn && (
        <div style={{ marginTop: 20 }}>
          <form
            onSubmit={handleSubmit(contactServer)}
            className="content-section-border"
          >
            <legend className="border-bottom mb-4">Log In</legend>
            <div className="form-group mb-4">
              <label>Email</label>
              <input
                type="text"
                {...register("email")}
                name="email"
                placeholder="Email"
                className="form-control form-control mb-2"
              />
              {errors?.email && (
                <p className="alert alert-warning">{errors.email?.message}</p>
              )}
              {}
            </div>
            <div className="form-group mb-4">
              <label>Password</label>
              <input
                type="password"
                name="password"
                {...register("password")}
                placeholder="Password"
                className="form-control form-control mb-2"
              />
            </div>
            <div className="form-ctrl">
              {serverRes.error && (
                <p className="alert alert-danger">{serverRes.error}</p>
              )}
            </div>
            <input
              type="submit"
              className="btn btn-primary mb-3"
              value="Login"
              style={{ backgroundColor: "#3333c4" }}
            />{" "}
            <button style={{ marginBottom: 15 }} class="btn btn-link link">
              <Link to="/request_reset" className="link">
                Forgot Password?
              </Link>
            </button>
            <div className="container">
              <p className="border-top mb-4 text-align">
                Don't have an account?{" "}
                <Link to="/register" className="link">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
