import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";
import { useForm } from "react-hook-form";
import { passwordResetSchema } from "../Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [serverRes, setServerRes] = useState();
  const [display, setDisplay] = useState(0);
  const token = searchParams.get("token");
  useEffect(() => {
    const sendToken = async (token) => {
      const res = await fetch(`/verify_token/${token}`);
      const data = await res.json();
      if (res.status === 200) {
        setDisplay(1);
      } else {
        setDisplay(2);
      }
      setServerRes(data);
      return data;
    };
    sendToken(token);
  }, [token]);
  //   Send to Server
  const contactServer = async (eml) => {
    const res = await fetch(`/resetPassword/${token}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(eml),
    });
    const data = await res.json();
    setServerRes(data);
    if (res.status === 200) {
      setDisplay(3);
    }
  };

  // initializing react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(passwordResetSchema),
  });
  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit(contactServer)} className="container">
        <div className="container content-section-border">
          {display === 2 && (
            <div>
              <legend className="border-bottom mb-4">Reset Password.</legend>
              <div className="form-group">
                <p className="alert alert-danger form-ctrl input">
                  {serverRes && serverRes.error}
                </p>
              </div>
              <div className="container">
                <p className="border-top mb-4 text-align">
                  Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
              </div>
            </div>
          )}
          {display === 1 && (
            <div>
              <legend className="border-bottom mb-4">Reset Password.</legend>
              <div className="form-group mb-4">
                <label>Password</label>
                <input
                  type="password"
                  {...register("password")}
                  name="password"
                  placeholder="Password"
                  className="form-control"
                />
                {errors?.password && (
                  <p className="alert alert-warning form-ctrl input">
                    {errors.password?.message}
                  </p>
                )}
              </div>
              <div className="form-group mb-2">
                <label>Confirm Password</label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  name="confirmPassword"
                  placeholder="confirmPassword"
                  className="form-control"
                />
                {errors?.confirmPassword && (
                  <p className="alert alert-warning form-ctrl input">
                    {errors.confirmPassword?.message}
                  </p>
                )}
              </div>
              <input
                type="submit"
                className="btn btn-primary mb-3"
                value="Reset Password"
                style={{ backgroundColor: "#3333c4" }}
              />
              <div className="container">
                <p className="border-top mb-4 text-align">
                  Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
              </div>
            </div>
          )}
          {display === 3 && (
            <div>
              <legend className="border-bottom mb-4">Reset Password.</legend>
              <div className="form-group">
                <p className="alert alert-success form-ctrl input">
                  {serverRes && serverRes.msg}
                </p>
              </div>
              <div className="container">
                <p className="border-top mb-4 text-align">
                  Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
