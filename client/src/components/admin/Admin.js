import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { getData, refreshToken } from "../../Utils";
import { Store } from "../../App";
import User from "./User";
import Cards from "./Cards";
import AddCardCategory from "./AddCardCategory";
import Category from "./Category";
import Header from "../Header";
import Withdrawal from "./Withdrawal";

const Admin = () => {
  const { store, dispatch } = useContext(Store);
  const navigate = useNavigate();
  const [modalData, setModalData] = useState("3");
  const [tab, setTab] = useState(0);
  const [admin, setAdmin] = useState({});
  useEffect(() => {
    const event = async () => {
      const usersData = await getData("/admin/user", navigate);
      const cardsData = await getData("/admin/card", navigate);
      const categoriesData = await getData("/admin/category", navigate);
      const withdrawalsData = await getData("/admin/withdrawal", navigate);
      dispatch({
        type: "STORE_WITHDRAWALS",
        payload: withdrawalsData,
      });
      dispatch({
        type: "STORE_CATEGORIES",
        payload: categoriesData,
      });
      dispatch({
        type: "STORE_USERS",
        payload: usersData,
      });
      dispatch({
        type: "STORE_CARDS",
        payload: cardsData,
      });
    };
    const adminCheck = async () => {
      const adminData = await getData("/admin", navigate);
      if (adminData.firstname) {
        setAdmin(adminData);
        event();
      } else {
        navigate("/403");
      }
    };
    adminCheck();
  }, [dispatch, navigate]);
  const toServer = async (eml) => {
    let res, token;
    token = localStorage.getItem("access_token");
    res = await fetch(eml.route, {
      method: eml.method,
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
      res = await fetch(eml.route, {
        method: eml.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(eml),
      });
      if (res.status === 200) {
        dispatch({
          type: eml.dispatch,
          payload: eml,
        });
      }
    } else if (res.status === 200) {
      dispatch({
        type: eml.dispatch,
        payload: eml,
      });
    }
  };
  // modal
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];
  const showModal = (card) => {
    setModalData(card);
    modal.style.display = "block";
  };
  if (span) {
    span.onclick = function () {
      modal.style.display = "none";
    };
  }
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  return (
    <>
      {admin?.firstname && (
        <div>
          <Header />
          {/* Modal */}
          <div id="myModal" className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>
                  {modalData.action &&
                    ((modalData.action === "Approved" && "Approve?") ||
                      (modalData.action === "Declined" && "Decline?") ||
                      (modalData.action === "Failed" && "Fail?") ||
                      (modalData.action === "Delete" && "Delete?"))}
                </h2>
                <span className="close">&times;</span>
              </div>
              <div className="modal-body">
                <p>Are you sure about this?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => span.onclick()}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    toServer(modalData);
                    span.onclick();
                  }}
                  className={`btn ${
                    modalData.action && modalData.action === "Approved"
                      ? "btn-success"
                      : "btn-danger"
                  }`}
                >
                  {modalData.action &&
                    ((modalData.action === "Approved" && "Approve") ||
                      (modalData.action === "Failed" && "Fail") ||
                      (modalData.action === "Declined" && "Decline") ||
                      (modalData.action === "Delete" && "Delete"))}
                </button>
              </div>
            </div>
          </div>
          <div className="cs-class cs-3">
            <p className="container content-section-border mb-4">
              <strong>Admin: </strong>
              {admin.firstname} {admin.lastname} ({admin.email})
            </p>
            <div className="row dashboard">
              <button
                className={`tab btn btn-${tab === 0 ? "primary" : "light"}`}
                onClick={() => setTab(0)}
              >
                Pending Cards
              </button>
              <button
                className={`tab btn btn-${tab === 1 ? "primary" : "light"}`}
                onClick={() => setTab(1)}
              >
                Withdrawals
              </button>
              <button
                className={`tab btn btn-${tab === 2 ? "primary" : "light"}`}
                onClick={() => setTab(2)}
              >
                All Users
              </button>
              <button
                className={`tab btn btn-${tab === 3 ? "primary" : "light"}`}
                onClick={() => setTab(3)}
              >
                All Categories
              </button>
              <button
                className={`tab btn btn-${tab === 4 ? "primary" : "light"}`}
                onClick={() => setTab(4)}
              >
                Add Category
              </button>
              <div className="scroll">
                {tab === 0 && (
                  <table className="table table-striped">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="row text-align">Image</th>
                        <th scope="col">ID</th>
                        <th scope="col">Issuer</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Currency</th>
                        <th scope="col">@Rate</th>
                        <th scope="col">Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.cards &&
                        store.cards
                          .filter((card) => card.status === "Pending")
                          .map((card) => (
                            <Cards
                              key={card.id}
                              card={card}
                              onClick={showModal}
                            />
                          ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="scroll">
                {tab === 1 && (
                  <table className="table table-striped">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="row text-align">User ID</th>
                        <th scope="col">User</th>
                        <th scope="col">Bank Name</th>
                        <th scope="col">Account No</th>
                        <th scope="col">Amount(NGN)</th>
                        <th scope="col">Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.withdrawals &&
                        store.withdrawals
                          .filter(
                            (withdrawal) => withdrawal.status === "Pending"
                          )
                          .map((withdrawal) => (
                            <Withdrawal
                              key={withdrawal.id}
                              withdrawal={withdrawal}
                              onClick={showModal}
                            />
                          ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="scroll">
                {tab === 2 && (
                  <table className="table table-striped">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">User ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.users.map((user) => (
                        <User key={user.id} user={user} />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="scroll">
                {tab === 3 && (
                  <table className="table table-striped">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Issuer</th>
                        <th scope="col">Card Type</th>
                        <th scope="col">Currency</th>
                        <th scope="col">Rate</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.categories &&
                        store.categories.map((category) => (
                          <Category
                            key={category.id}
                            category={category}
                            onClick={showModal}
                          />
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div>{tab === 4 && <AddCardCategory />}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
