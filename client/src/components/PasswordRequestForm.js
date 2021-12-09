import { useForm } from "react-hook-form";
import { Store } from "../App";
import { useState, useContext } from "react";
import { emailSchema } from "../Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";

const PasswordRequestForm = () => {
  const [serverRes, setServerRes] = useState({});
  const [display, setDisplay] = useState(0);
  const contactServer = async (formData) => {
    const res = await fetch("/resetPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.status === 200) {
      setDisplay(1);
    }
    setServerRes(data);
  };

  // initializing react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(emailSchema),
  });
  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit(contactServer)} className="container">
        {display === 0 && (
          <div className="container content-section-border">
            <legend className="border-bottom mb-4">
              Request Password Reset
            </legend>
            <div className="form-group mb-2">
              <label>Email</label>
              <input
                type="text"
                {...register("email")}
                name="email"
                placeholder="Enter Email"
                className="form-control"
              />
              <div className="form-ctrl">
                {errors?.email && (
                  <p className="alert alert-warning form-ctrl-input">
                    {errors.email?.message}
                  </p>
                )}
              </div>
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
        {display === 1 && (
          <div className="container content-section-border">
            <p className="alert alert-info" style={{ minHeight: 65 }}>
              {serverRes.msg}
            </p>
            <div className="container">
              <p className="border-top mb-4 text-align">
                Don't have an account? <Link to="/register">Sign Up</Link>
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PasswordRequestForm;
