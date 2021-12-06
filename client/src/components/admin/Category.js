import { useState, useContext } from "react";
import { Store } from "../../App";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { refreshToken, categoryEditSchema } from "../../Utils";
import { useForm } from "react-hook-form";

const Category = ({ category, onClick }) => {
  const { dispatch } = useContext(Store);
  const [edit, toggleEdit] = useState(1);
  const [CTG, setCTG] = useState({ ...category });
  const navigate = useNavigate();

  const toServer = async (eml) => {
    let res, token;
    token = localStorage.getItem("access_token");
    res = await fetch(`/admin/category/${category.id}`, {
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
      res = await fetch(`/admin/category/${category.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(eml),
      });
      if (res.status === 200) {
        toggleEdit(1);
        dispatch({
          type: "EDIT_CATEGORY",
          payload: { ...eml, id: category.id },
        });
      }
    } else if (res.status === 200) {
      toggleEdit(1);
      dispatch({
        type: "EDIT_CATEGORY",
        payload: { ...eml, id: category.id },
      });
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categoryEditSchema),
  });
  return (
    <>
      {edit === 1 && (
        <>
          <tr>
            <td style={{ paddingTop: 20 }}>{category.issuer}</td>
            <td style={{ paddingTop: 20 }}>{category.card_type}</td>
            <td style={{ paddingTop: 20 }}>{category.currency}</td>
            <td style={{ paddingTop: 20 }}>{category.rate}</td>
            <td className="col-2">
              <button className="btn btn-success" onClick={() => toggleEdit(2)}>
                Edit
              </button>
              <span style={{ paddingLeft: 10 }}>
                <button
                  className="btn btn-danger"
                  style={{ paddingLeft: 10 }}
                  onClick={() =>
                    onClick({
                      ...category,
                      action: "Delete",
                      dispatch: "DELETE_CATEGORY",
                      route: `/admin/category/${category.id}`,
                      method: "DELETE",
                    })
                  }
                >
                  Delete
                </button>
              </span>
            </td>
          </tr>
        </>
      )}
      {edit === 2 && (
        <tr>
          <th scope="row" style={{ paddingTop: 13 }}>
            <select
              name="issuer"
              {...register("issuer")}
              id="issuer"
              className="btn btn-outline-dark"
              value={CTG.issuer}
              onChange={(e) => setCTG({ ...CTG, issuer: e.target.value })}
            >
              <option value="Amazon">Amazon</option>
              <option value="Google">Google</option>
              <option value="Steam">Steam</option>
            </select>
            {errors?.issuer && (
              <p className="alert alert-warning form-ctrl input">
                {errors.issuer?.message}
              </p>
            )}
          </th>
          <td style={{ paddingTop: 13 }}>
            <select
              name="card_type"
              {...register("card_type")}
              id="card_type"
              className="btn btn-outline-dark"
              value={CTG.card_type}
              onChange={(e) => setCTG({ ...CTG, card_type: e.target.value })}
            >
              <option value="Small">Small Card</option>
              <option value="Large">Large Card</option>
              <option value="Small/Large">Both</option>
            </select>
            {errors?.card_type && (
              <p className="alert alert-warning form-ctrl input">
                {errors.card_type?.message}
              </p>
            )}
          </td>
          <td style={{ paddingTop: 13 }}>
            <select
              name="currency"
              {...register("currency")}
              id="currency"
              className="btn btn-outline-dark"
              value={CTG.currency}
              onChange={(e) => setCTG({ ...CTG, currency: e.target.value })}
            >
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
              <option value="NZD">NZD</option>
            </select>
            {errors?.currency && (
              <p className="alert alert-warning form-ctrl input">
                {errors.currency?.message}
              </p>
            )}
          </td>
          <td style={{ paddingTop: 17 }}>
            <input
              type="text"
              name="rate"
              {...register("rate")}
              size="4"
              value={CTG.rate}
              onChange={(e) => setCTG({ ...CTG, rate: e.target.value })}
            />
            {errors?.rate && (
              <p className="alert alert-warning form-ctrl input">
                {errors.rate?.message}
              </p>
            )}
          </td>
          <td className="col-2">
            <button
              className="btn btn-success"
              onClick={handleSubmit(toServer)}
            >
              Update
            </button>
            <span style={{ paddingLeft: 10 }}>
              <button
                className="btn btn-secondary"
                onClick={() => toggleEdit(1)}
              >
                Close
              </button>{" "}
            </span>
          </td>
        </tr>
      )}
    </>
  );
};

export default Category;
