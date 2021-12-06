import { useForm } from "react-hook-form";
import { Store } from "../../App";
import { yupResolver } from "@hookform/resolvers/yup";
import { cardCategorySchema, refreshToken } from "../../Utils";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AddCardCategory = () => {
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();
  const [formState, setFormState] = useState(1);
  const [serverRes, setServerRes] = useState({});
  const contactServer = async (eml) => {
    let res, token, data;
    token = localStorage.getItem("access_token");
    res = await fetch("/admin/category", {
      method: "POST",
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
      res = await fetch("/admin/category", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(eml),
      });
      data = await res.json();
      if (res.status === 200) {
        dispatch({
          type: "STORE_CATEGORIES",
          payload: data,
        });
        setFormState(2);
        return;
      }

      setServerRes(data);
    } else if (res.status === 200) {
      data = await res.json();
      dispatch({
        type: "STORE_CATEGORIES",
        payload: data,
      });
      setFormState(2);
      return;
    } else {
      data = await res.json();
      setServerRes(data);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(cardCategorySchema),
  });

  return (
    <div>
      {formState === 1 ? (
        <form onSubmit={handleSubmit(contactServer)} className="container">
          <div className="">
            <legend className="border-bottom">Add Category</legend>
            <div className="row">
              <div className="col mb-4">
                <label style={{ margin: 5 }}>Issuer:</label>
                <select
                  {...register("issuer")}
                  name="issuer"
                  id="issuer"
                  className="form-select ml-4"
                >
                  <option value="Amazon">Amazon</option>
                  <option value="Google">Google</option>
                  <option value="Steam">Steam</option>
                  <option value="ebay">ebay</option>
                  <option value="Vanilla">Vanilla</option>
                  <option value="Sephora">Sephora</option>
                  <option value="Apple">Apple</option>
                  <option value="iTunes">iTunes</option>
                  <option value="Walmart">Walmart</option>
                </select>
                {errors?.issuer && (
                  <p className="alert alert-warning form-ctrl input">
                    {errors.issuer?.message}
                  </p>
                )}
              </div>
              <div className="col mb-4">
                <label style={{ margin: 5 }} htmlFor="cardType">
                  Type:
                </label>
                <select
                  {...register("cardType")}
                  name="cardType"
                  id="cardType"
                  className="form-select ml-4"
                >
                  <option value="Small">Small Card</option>
                  <option value="Large">Large Card</option>
                </select>
              </div>
              <div className="col mb-4">
                <label style={{ margin: 5 }} htmlFor="currency">
                  Currency:
                </label>
                <select
                  {...register("currency")}
                  name="currency"
                  id="currency"
                  className="form-select ml-4"
                >
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                  <option value="NZD">NZD</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <div className="col">
                <label>Rate</label>
                <input
                  type="text"
                  {...register("rate")}
                  name="rate"
                  placeholder="add rate"
                  size="6"
                  className="form-control form-control-lg mb-4"
                />
                {errors?.rate && (
                  <p className="alert alert-warning form-ctrl input">
                    {errors.rate?.message}
                  </p>
                )}
              </div>
              <input
                type="submit"
                value="Add Category"
                className="btn btn-primary mb-2"
              />
              {serverRes.error && (
                <p className="alert alert-warning">{serverRes.error}</p>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div>
          <p className="alert alert-success" style={{ marginTop: 5 }}>
            Category added successfully
          </p>
          <button onClick={() => setFormState(1)} className="btn btn-info">
            Add another Category
          </button>
        </div>
      )}
    </div>
  );
};

export default AddCardCategory;
