import { useForm } from "react-hook-form";
import { Store } from "../App";
import { yupResolver } from "@hookform/resolvers/yup";
import { regSchema } from "../Utils";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Register = () => {
  const { store } = useContext(Store);
  const [formStep, setFormStep] = useState(0);
  const [serverRes, setServerRes] = useState({});
  let navigate = useNavigate();
  useEffect(() => {
    store.loggedIn && navigate("/");
  });

  const contactServer = async (eml) => {
    const res = await fetch("/register-user", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(eml),
    });
    const data = await res.json();
    setServerRes(data);
    if (data.email == null) {
      setFormStep(1);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(regSchema),
  });

  return (
    <div>
      <Header />
      {!store.loggedIn && (
        <div style={{ marginTop: 20 }}>
          <form onSubmit={handleSubmit(contactServer)}>
            {formStep === 0 && (
              <div className="container content-section-border">
                <legend className="border-bottom mb-4">Register</legend>
                <div className="form-group mb-4">
                  <label>Email</label>
                  <input
                    type="text"
                    {...register("email")}
                    name="email"
                    placeholder="Email"
                    className="form-control form-control mb-2"
                  />
                  {serverRes.email && (
                    <p className="alert alert-danger">{serverRes.email}</p>
                  )}
                  {errors?.email && (
                    <p className="alert alert-warning">
                      {errors.email?.message}
                    </p>
                  )}
                </div>
                <div className="form-group mb-4">
                  <label>First Name</label>
                  <input
                    type="text"
                    {...register("firstname")}
                    name="firstname"
                    placeholder="First name"
                    className="form-control form-control mb-2"
                  />
                  {errors?.firstname && (
                    <p className="alert alert-warning">
                      {errors.firstname?.message}
                    </p>
                  )}
                </div>
                <div className="form-group mb-4">
                  <label>Last Name</label>
                  <input
                    type="text"
                    {...register("lastname")}
                    name="lastname"
                    placeholder="Last name"
                    className="form-control form-control mb-2"
                  />
                  {errors?.lastname && (
                    <p className="alert alert-warning">
                      {errors.lastname?.message}
                    </p>
                  )}
                </div>
                <div className="form-group mb-4">
                  <label>Password</label>
                  <input
                    type="password"
                    {...register("password")}
                    name="password"
                    placeholder="Password"
                    className="form-control form-control mb-2"
                  />
                  {errors?.password && (
                    <p className="alert alert-warning">
                      {errors.password?.message}
                    </p>
                  )}
                </div>
                <div className="form-group mb-4">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="form-control form-control mb-2"
                  />
                  {errors?.confirmPassword && (
                    <p className="alert alert-warning">
                      {errors.confirmPassword?.message}
                    </p>
                  )}
                </div>
                <div className="form-check">
                  <input
                    name="terms"
                    {...register("terms")}
                    type="checkbox"
                    className="form-check-input"
                  />
                  <label className="form-check-label mb-2">
                    I accept the{" "}
                    <a href="#" className="link">
                      terms and conditions.
                    </a>
                  </label>
                </div>{" "}
                {errors?.terms && (
                  <p className="alert alert-warning">{errors.terms?.message}</p>
                )}
                <input
                  type="submit"
                  value="Sign Up"
                  className="btn btn-primary"
                  style={{ backgroundColor: "#3333c4" }}
                />
              </div>
            )}
            {formStep === 1 && (
              <div className="content-section-border">
                <legend className="border-bottom mb-4">
                  Verify your email.
                </legend>
                <div className="form-group mb-4">
                  <p className="alert alert-info" style={{ minHeight: 100 }}>
                    {serverRes.response}
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
