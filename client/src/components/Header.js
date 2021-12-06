import { Link, useNavigate } from "react-router-dom";
import { Store } from "../App";
import { useContext } from "react";
import { BsList } from "react-icons/bs";

const Header = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useContext(Store);
  return (
    <header>
      <div className="cs-class">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <button className="btn btn-success">Vaito</button>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <BsList />
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item" style={{ width: 108 }}>
                  <Link to="/sell-giftcard" className="nav-link">
                    Sell Giftcards
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>{" "}
        <nav className="userNav">
          {store.loggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link link">
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: "#3333c4" }}
                  onClick={() => {
                    dispatch({
                      type: "LOGOUT_SUCCESS",
                    });
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link link">
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <button
                    className="btn btn-primary"
                    style={{ backgroundColor: "#3333c4" }}
                  >
                    Sign up
                  </button>
                </Link>
              </li>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
