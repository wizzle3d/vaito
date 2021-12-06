import { useEffect, useState, useContext } from "react";
import Header from "./Header";
import Support from "./Support";
import MyCards from "./MyCards";
import PaymentInfo from "./PaymentInfo";
import { getData, refreshToken } from "../Utils";
import { useNavigate } from "react-router-dom";
import { Store } from "../App";
import Withdrawal from "./Withdrawal";
import { BsArrowRight } from "react-icons/bs";
import { IoIosCamera } from "react-icons/io";

const Dashboard = () => {
  const [serverRes, setServerRes] = useState();
  const { store, dispatch } = useContext(Store);
  const [tab, setTab] = useState(1);
  const [wtdl, openWtdl] = useState(1);
  const [wtdlDetails, setWtdlDetails] = useState({ amount: 0 });
  const navigate = useNavigate();
  useEffect(() => {
    let profileData = async (dispatch, navigate) => {
      let p = await getData("/profile", navigate);
      dispatch({
        type: "STORE_USER",
        payload: p,
      });
      let cards = await getData("/card", navigate);
      dispatch({
        type: "STORE_CARDS",
        payload: cards,
      });
    };
    if (store.loggedIn) {
      profileData(dispatch, navigate);
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);
  const requestCode = async () => {
    let data = await getData("/request_withdrawal", navigate);
    if (data.msg) {
      setServerRes({ ...data });
      openWtdl(3);
    }
  };
  const showWidget = () => {
    let widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "wizzle3d",
        uploadPreset: "hasuhajhj",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          toServer(
            {
              image: result.info.url,
            },
            "/profile_image",
            navigate,
            "/dashboard"
          );
        }
      }
    );
    widget.open();
  };

  const toServer = async (eml, endpoint, after, action) => {
    let token, res, data;
    token = localStorage.getItem("access_token");
    res = await fetch(`${endpoint}`, {
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
      res = await fetch(`${endpoint}`, {
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
        after(action);
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
      after(action);
    }
  };
  return (
    <div>
      <Header />
      <script
        src="https://upload-widget.cloudinary.com/global/all.js"
        type="text/javascript"
      ></script>
      <div className="cs-class cs-3" style={{ marginTop: 20 }}>
        <div className="row dashboard">
          <div className="col text-align">
            <div className="">
              <img
                alt=""
                src={store.user.profile_pic}
                className="rounded-circle account-img"
              />
            </div>
            <h5>
              {store.user.firstname} {store.user.lastname}
            </h5>
            <h5>{store.user.email}</h5>
            <button
              type="hidden"
              className="btn btn-primary"
              onClick={() => showWidget()}
            >
              <IoIosCamera className="img-overlay" /> Change profile picture
            </button>
          </div>
          <div className="col">
            {wtdl === 1 && (
              <div className="text-align">
                <h3>{store.user.balance} Naira</h3>
                <button className="btn btn-success" onClick={() => openWtdl(2)}>
                  Withdraw
                </button>
              </div>
            )}
            {wtdl === 2 && (
              <div>
                <span style={{ float: "right" }}>
                  Balance:<strong>{store.user.balance}</strong>
                </span>
                <div className="input-group mb-3" style={{ textAlign: "left" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Withdrawal Amount"
                    onChange={(e) =>
                      setWtdlDetails({ ...wtdlDetails, amount: e.target.value })
                    }
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className={`btn btn-success ${
                        (wtdlDetails.amount > store.user.balance &&
                          "disabled") ||
                        (wtdlDetails.amount < 1000 && "disabled")
                      }`}
                      onClick={() =>
                        wtdlDetails.amount <= store.user.balance &&
                        wtdlDetails.amount > 1000 &&
                        requestCode()
                      }
                    >
                      <BsArrowRight />
                    </button>
                  </div>
                </div>
                {wtdlDetails.amount > store.user.balance && (
                  <p className="alert alert-warning">
                    Amount must be less than balance
                  </p>
                )}
                {wtdlDetails.amount < 1000 && (
                  <p className="alert alert-warning">
                    Amount must be over NGN 1000
                  </p>
                )}
              </div>
            )}
            {wtdl === 3 && (
              <div>
                {serverRes.msg && (
                  <p
                    className="alert alert-info text-align"
                    style={{ minHeight: 60 }}
                  >
                    {serverRes?.msg}
                  </p>
                )}
                <div className="input-group mb-3" style={{ textAlign: "left" }}>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) =>
                      setWtdlDetails({ ...wtdlDetails, code: e.target.value })
                    }
                    placeholder="Enter Withdrawal Code"
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() =>
                        toServer(
                          wtdlDetails,
                          "/request_withdrawal",
                          openWtdl,
                          4
                        )
                      }
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
                {serverRes.error && (
                  <p className="alert alert-danger">{serverRes.error}</p>
                )}
              </div>
            )}
            {wtdl === 4 && (
              <div>
                <p
                  className="alert alert-success text-align"
                  style={{ minHeight: 60 }}
                >
                  You have withdrawn NGN {wtdlDetails.amount}, click on the
                  withdrawals tab to see progress
                </p>
                <button
                  className="btn btn-success"
                  style={{ float: "right" }}
                  onClick={() => openWtdl(1)}
                >
                  See Balance
                </button>
              </div>
            )}
          </div>
          <div className="col text-align">
            <h3>{store.cards && store.cards.length} cards uploaded</h3>
            <p>
              {" "}
              {store.cards &&
                store.cards.filter((card) => card.status === "Pending")
                  .length}{" "}
              under processing
            </p>
          </div>
        </div>
        <div className="row dashboard">
          <button
            className={`tab btn btn-${tab === 1 ? "primary" : "light"}`}
            onClick={() => setTab(1)}
            style={{ padding: 10 }}
          >
            My Cards
          </button>
          <button
            className={`tab btn btn-${tab === 2 ? "primary" : "light"}`}
            onClick={() => setTab(2)}
            style={{ padding: 10 }}
          >
            Withdrawals
          </button>
          <button
            className={`tab btn btn-${tab === 3 ? "primary" : "light"}`}
            onClick={() => setTab(3)}
            style={{ padding: 10 }}
          >
            Payment Info
          </button>
          <button
            className={`tab btn btn-${tab === 4 ? "primary" : "light"}`}
            onClick={() => setTab(4)}
            style={{ padding: 10 }}
          >
            Support
          </button>
        </div>
        <div className="row dashboard">
          {tab === 1 && (
            <div className="scroll">
              <table className="table table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th scope="row">Image</th>
                    <th scope="col">Issuer</th>
                    <th scope="col">Amount ($)</th>
                    <th scope="col">Currency</th>
                    <th scope="col">Rate (NGN/$)</th>
                    <th scope="col">Status</th>
                    <th scope="col">Upload Date</th>
                  </tr>
                </thead>
                <tbody>
                  {store.cards &&
                    store.user.cards
                      ?.sort((a, b) => (a.date_posted > b.date_posted ? -1 : 1))
                      .map((card) => <MyCards key={card.id} card={card} />)}
                </tbody>
              </table>
            </div>
          )}
          {tab === 2 && (
            <div className="scroll">
              <table className="table table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th scope="row">Amount (NGN)</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {store.user.withdrawals
                    ?.sort((a, b) => (a.date_posted > b.date_posted ? -1 : 1))
                    .map((wtdl) => (
                      <Withdrawal wtdl={wtdl} key={wtdl.id} />
                    ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === 3 && <PaymentInfo />}
          {tab === 4 && <Support />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
