import { useForm } from "react-hook-form";
import { Store } from "../../App";
import { useState, useContext } from "react";
import { loginSchema } from "../../Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdmLogin = () => {
  const [display, setDisplay] = useState(0);
  const [serverRes, setServerRes] = useState({});
  const { store, dispatch } = useContext(Store);
  let navigate = useNavigate();
  useEffect(() => {
    if (store.loggedIn) {
      setDisplay(2);
    } else {
      setDisplay(1);
    }
    display === 2 && navigate("/admin/dashboard");
  }, [store.loggedIn, display, navigate]);

  //submit to server fuction for when form validates on submit
  const contactServer = async (formData) => {
    const res = await fetch("/admin", {
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
      navigate("/admin/dashboard", { replace: true });
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
    <div>
      {display === 1 && (
        <div style={{ marginTop: 50 }}>
          <form onSubmit={handleSubmit(contactServer)} className="container">
            <div className="container content-section-border">
              <legend className="border-bottom mb-4">Log In</legend>
              <div className="form-group mb-4">
                <label>Email</label>
                <input
                  type="text"
                  {...register("email")}
                  name="email"
                  placeholder="Email"
                  className="form-control"
                  onChange={() => setServerRes({})}
                />
                {errors?.email && (
                  <p className="alert alert-warning form-ctrl-input">
                    {errors.email?.message}
                  </p>
                )}
                {}
              </div>
              <div className="form-group mb-2">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  {...register("password")}
                  placeholder="Password"
                  className="form-control"
                  onChange={() => setServerRes({})}
                />
              </div>
              <div className="form-ctrl">
                {serverRes.error && (
                  <p className="alert alert-danger">{serverRes.error}</p>
                )}
              </div>
              <input
                type="submit"
                className="btn btn-primary"
                value="Login"
                style={{ backgroundColor: "#3333c4" }}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdmLogin;
