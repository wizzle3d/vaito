import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileUpdateSchema, uploadImage, refreshToken } from "../Utils";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../App";

const PaymentInfo = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useContext(Store);
  const [formPopulate, setFormPopulate] = useState(store.user);
  const [serverRes, setServerRes] = useState({});
  const [formView, setFormView] = useState(0);
  const toServer = async (eml) => {
    let image_url, token, res, data;
    token = localStorage.getItem("access_token");
    res = await fetch(`/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(eml),
    });
    if (res.status === 403) {
      navigate("/403");
      return;
    } else if (res.status === 401) {
      await refreshToken();
      token = localStorage.getItem("access_token");
      res = await fetch(`/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(eml),
      });
      if (res.status === 200) {
        data = await res.json();
        dispatch({
          type: "STORE_USER",
          payload: data,
        });
        setFormView(0);
      } else if (res.status === 400) {
        data = await res.json();
        setServerRes(data);
      }
    } else if (res.status === 400) {
      data = await res.json();
      setServerRes(data);
    } else if (res.status === 200) {
      data = await res.json();
      dispatch({
        type: "STORE_USER",
        payload: data,
      });
      setFormView(0);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileUpdateSchema),
  });
  return (
    <>
      {formView === 1 && (
        <form onSubmit={handleSubmit(toServer)} className="container">
          <div>
            <legend className="border-bottom">Update Payment Info</legend>
            <div className="row" style={{ textAlign: "left" }}>
              <div className="form-group col">
                <label>Bank Name</label>
                <input
                  type="text"
                  {...register("bank_name")}
                  name="bank_name"
                  value={formPopulate.bank_name}
                  onChange={(e) =>
                    setFormPopulate({
                      ...formPopulate,
                      bank_name: e.target.value,
                    })
                  }
                  placeholder="Enter bank name"
                  className="form-control form-control"
                />
                {errors?.bank_name && (
                  <p className="alert alert-warning">
                    {errors.bank_name?.message}
                  </p>
                )}
              </div>
              <div className="form-group col">
                <label>Bank Account Number</label>
                <input
                  type="text"
                  {...register("bank_account_no")}
                  name="bank_account_no"
                  value={formPopulate.bank_account_no}
                  onChange={(e) =>
                    setFormPopulate({
                      ...formPopulate,
                      bank_account_no: e.target.value,
                    })
                  }
                  placeholder="Enter bank account number"
                  className="form-control form-control"
                />
                {errors?.bank_account_no && (
                  <p className="alert alert-warning">
                    {errors.bank_account_no?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="row" style={{ textAlign: "left" }}>
            <div className="form-group col">
              <label>Enter Password to confirm update</label>
              <input
                type="password"
                {...register("password")}
                name="password"
                placeholder="Enter Password to confirm"
                className="form-control form-control"
              />
              {serverRes.error && (
                <p className="alert alert-danger ">{serverRes.error}</p>
              )}
              {errors?.password && (
                <p className="alert alert-warning">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <div className="form-group">
              <input
                type="submit"
                value="Update"
                className="btn btn-primary btn-action"
                style={{ marginTop: 10 }}
              />
            </div>
          </div>
        </form>
      )}
      {formView === 0 && (
        <div className="container row" style={{ textAlign: "left" }}>
          <div className="col">
            <label>Bank Name</label>
            <h5>{store.user.bank_name}</h5>
          </div>
          <div className="col">
            <label>Bank Account no</label>
            <h5>{store.user.bank_account_no}</h5>
          </div>
          <div>
            <button className="btn btn-info" onClick={() => setFormView(1)}>
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentInfo;
