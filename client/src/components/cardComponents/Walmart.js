import { useState, useContext, useEffect } from "react";
import { Store } from "../../App";
import Header from "../Header";
import { refreshToken, getData } from "../../Utils";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

import { MdCardGiftcard } from "react-icons/md";

const Walmart = () => {
  const { store, dispatch } = useContext(Store);
  const navigate = useNavigate();
  const [state, setState] = useState({ issuer: "Walmart", notes: "" });
  useEffect(() => {
    const event = async () => {
      const categoriesData = await getData("/category", navigate);

      dispatch({
        type: "STORE_CATEGORIES",
        payload: categoriesData,
      });
    };
    if (store.loggedIn) {
      event();
    } else {
      navigate("/login");
    }
  }, []);

  // Category filtering
  const walmartCategories = store.categories.filter(
    (category) => category.issuer === "Walmart"
  );
  const availableCurrency = walmartCategories.map((cur) => cur.currency);
  const availableSize = walmartCategories
    .filter((category) => category.currency === state.currency)
    .map((cat) => cat.card_type);
  const finalCategory = walmartCategories.filter(
    (category) => category.currency === state.currency
  );

  // Initializing Cloudinary Upload Widget
  const showWidget = () => {
    let widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "wizzle3d",
        uploadPreset: "hasuhajhj",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          toServer({
            ...state,
            image: result.info.url,
            rate: finalCategory.rate,
          });
        }
      }
    );
    widget.open();
  };
  const toServer = async (eml) => {
    let res, token, data;
    token = localStorage.getItem("access_token");
    res = await fetch(`/card/${finalCategory.id}`, {
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
      res = await fetch(`/card/${finalCategory.id}`, {
        method: "POST",
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
        navigate("/dashboard");
      }
    } else if (res.status === 200) {
      data = await res.json();
      dispatch({
        type: "STORE_USER",
        payload: data,
      });
      navigate("/dashboard");
    }
  };
  return (
    <div>
      <Header />
      {store.loggedIn && (
        <>
          <script
            src="https://upload-widget.cloudinary.com/global/all.js"
            type="text/javascript"
          ></script>
          <div className="content-section">
            <div className="cs-row">
              <div className="column2">
                <img
                  alt=""
                  src="https://res.cloudinary.com/wizzle3d/image/upload/v1638564256/ad4559e4897523f102c50c974d33b_1617430003145_abnmlk.png"
                  style={{ width: 200, height: 118, objectFit: "scale-down" }}
                />
              </div>
              <div className="column">
                <legend className="border-bottom mb-4">Select Currency</legend>
                <div className="text-center">
                  {availableCurrency.includes("USD") && (
                    <div
                      className="form-check form-check-inline"
                      style={{ paddingLeft: 27, paddingRight: 27 }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="currency"
                        id="inlineRadio1"
                        value="USD"
                        onChange={(e) =>
                          setState({ ...state, currency: e.target.value })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio1"
                      >
                        <img
                          alt=""
                          src="https://res.cloudinary.com/wizzle3d/image/upload/v1638113157/vaito/usa_rvklud.png"
                          style={{ width: 40, height: 30 }}
                        />
                        <p>USD</p>
                      </label>
                    </div>
                  )}
                  {availableCurrency.includes("GBP") && (
                    <div
                      className="form-check form-check-inline"
                      style={{ paddingLeft: 27, paddingRight: 27 }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="currency"
                        id="inlineRadio2"
                        value="GBP"
                        onChange={(e) =>
                          setState({ ...state, currency: e.target.value })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio2"
                      >
                        <img
                          alt=""
                          src="https://res.cloudinary.com/wizzle3d/image/upload/v1638113157/vaito/GBP_mntmk8.png"
                          style={{ width: 40, height: 30 }}
                        />
                        <p>GBP</p>
                      </label>
                    </div>
                  )}
                  {availableCurrency.includes("EUR") && (
                    <div
                      className="form-check form-check-inline"
                      style={{ paddingLeft: 27, paddingRight: 27 }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="currency"
                        id="inlineRadio3"
                        value="EUR"
                        onChange={(e) =>
                          setState({ ...state, currency: e.target.value })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio3"
                      >
                        <img
                          alt=""
                          src="https://res.cloudinary.com/wizzle3d/image/upload/v1638113157/vaito/Flag_of_Europe.svg_ztwehn.png"
                          style={{ width: 40, height: 30 }}
                        />
                        <p>EUR</p>
                      </label>
                    </div>
                  )}
                  {availableCurrency.includes("CAD") && (
                    <div
                      className="form-check form-check-inline"
                      style={{ paddingLeft: 27, paddingRight: 27 }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="currency"
                        id="inlineRadio4"
                        value="CAD"
                        onChange={(e) =>
                          setState({ ...state, currency: e.target.value })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio4"
                      >
                        <img
                          alt=""
                          src="https://res.cloudinary.com/wizzle3d/image/upload/v1638113156/vaito/CAD_wjps9b.png"
                          style={{ width: 40, height: 30 }}
                        />
                        <p>CAD</p>
                      </label>
                    </div>
                  )}
                  {availableCurrency.includes("AUD") && (
                    <div
                      className="form-check form-check-inline"
                      style={{ paddingLeft: 27, paddingRight: 27 }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="currency"
                        id="inlineRadio5"
                        value="AUD"
                        onChange={(e) =>
                          setState({ ...state, currency: e.target.value })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio5"
                      >
                        <img
                          alt=""
                          src="https://res.cloudinary.com/wizzle3d/image/upload/v1638113157/vaito/AUD_wfiokk.png"
                          style={{ width: 40, height: 30 }}
                        />
                        <p>AUD</p>
                      </label>
                    </div>
                  )}
                  {availableCurrency.includes("NZD") && (
                    <div
                      className="form-check form-check-inline"
                      style={{ paddingLeft: 27, paddingRight: 27 }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="currency"
                        id="inlineRadio6"
                        value="NZD"
                        onChange={(e) =>
                          setState({ ...state, currency: e.target.value })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio6"
                      >
                        <img
                          alt=""
                          src="https://res.cloudinary.com/wizzle3d/image/upload/v1638113157/vaito/NZD_csgvuv.png"
                          style={{ width: 40, height: 30 }}
                        />
                        <p>NZD</p>
                      </label>
                    </div>
                  )}
                </div>
              </div>
              {state.currency && (
                <div className="column">
                  <legend className="border-bottom">
                    Select Card Size.{" "}
                    <span style={{ float: "right" }}>{state.currency}</span>
                  </legend>
                  {availableSize.includes("Small") && (
                    <div
                      className="form-check form-check-inline"
                      style={{ paddingLeft: 27, paddingRight: 27 }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="card_type"
                        id="Small"
                        value="Small"
                        onChange={(e) =>
                          setState({ ...state, card_type: e.target.value })
                        }
                      />
                      <label className="form-check-label" htmlFor="Small">
                        <p>
                          <MdCardGiftcard style={{ marginBottom: 4 }} />
                          <span>Small </span>($20-$200)
                        </p>
                      </label>
                    </div>
                  )}
                  {availableSize.includes("Large") && (
                    <div
                      className="form-check form-check-inline"
                      style={{ paddingLeft: 27, paddingRight: 27 }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="card_type"
                        id="Large"
                        value="Large"
                        onChange={(e) =>
                          setState({ ...state, card_type: e.target.value })
                        }
                      />
                      <label className="form-check-label" htmlFor="Large">
                        <p>
                          <MdCardGiftcard style={{ marginBottom: 4 }} />
                          <span>Large </span>($201-$500)
                        </p>
                      </label>
                    </div>
                  )}
                  {state.card_type && (
                    <div style={{ flex: 100 }}>
                      <div style={{ marginTop: 10 }}>
                        Rate for{" "}
                        {state.card_type && state.card_type.toLowerCase()} card
                        is:{" "}
                        <strong>
                          NGN{finalCategory && finalCategory.rate}
                        </strong>
                      </div>
                      <legend className="border-bottom mb-4"></legend>
                      <div className="form-inline">
                        <label>Value of card to be uploaded:</label>
                        <input
                          className="form-control mb-4"
                          type="text"
                          name="amount"
                          placeholder="Enter Value"
                          value={state.amount}
                          onChange={(e) =>
                            setState({ ...state, amount: e.target.value })
                          }
                        />
                        <label>Notes (optional):</label>
                        <input
                          className="form-control"
                          type="text"
                          name="notes"
                          placeholder="Optional descriptions"
                          value={state.notes}
                          onChange={(e) =>
                            setState({ ...state, notes: e.target.value })
                          }
                        />
                        <p
                          className="h6"
                          style={{ marginTop: 31, float: "left" }}
                        >
                          Total Amount: NGN{" "}
                          {finalCategory && state.amount
                            ? finalCategory.rate * state.amount
                            : 0}
                        </p>
                        {state.amount &&
                          state.card_type === "Large" &&
                          Number(state.amount) >= 201 &&
                          Number(state.amount) <= 500 && (
                            <button
                              className="btn btn-success btn-block"
                              style={{
                                float: "right",
                                marginTop: 20,
                                marginBottom: 10,
                              }}
                              onClick={() => showWidget()}
                            >
                              Upload GiftCard
                            </button>
                          )}
                        {state.amount &&
                          state.card_type === "Small" &&
                          Number(state.amount) >= 20 &&
                          Number(state.amount) <= 200 && (
                            <button
                              className="btn btn-success btn-block"
                              style={{
                                float: "right",
                                marginTop: 20,
                                marginBottom: 10,
                              }}
                              onClick={() => showWidget()}
                            >
                              Upload GiftCard
                            </button>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link to="/sell-giftcard" className="Footer">
              <button
                className="btn btn-primary"
                style={{ backgroundColor: "#3333c4" }}
              >
                <IoMdArrowRoundBack /> Go Back
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Walmart;
