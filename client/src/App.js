import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import AdmLogin from "./components/admin/AdmLogin";
import Error403 from "./components/errors/Error403";
import Error404 from "./components/errors/Error404";
import Admin from "./components/admin/Admin";
import Register from "./components/Register";
import Verify from "./components/Verify";
import React, { useReducer } from "react";
import Dashboard from "./components/Dashboard";
import SelectCard from "./components/SelectCard";
import PasswordRequestForm from "./components/PasswordRequestForm";
import ResetPassword from "./components/ResetPassword";
import Steam from "./components/cardComponents/Steam";
import Walmart from "./components/cardComponents/Walmart";
import Apple from "./components/cardComponents/Apple";
import Vanilla from "./components/cardComponents/Vanilla";
import Google from "./components/cardComponents/Google";
import Amazon from "./components/cardComponents/Amazon";
import Ebay from "./components/cardComponents/Ebay";
import Itunes from "./components/cardComponents/Itunes";
import Sephora from "./components/cardComponents/Sephora";
import Home from "./components/Home";

export const Store = React.createContext();

function App() {
  const initialState = {
    loggedIn: localStorage.getItem("access_token") ? true : false,
    user: {},
    users: [],
    categories: [],
  };
  let newState, newCat, newCards, newWithdrawals;
  const reducer = (state, action) => {
    switch (action.type) {
      case "LOGIN_SUCCESS":
        localStorage.setItem("access_token", action.payload.access_token);
        localStorage.setItem("refresh_token", action.payload.refresh_token);
        newState = {
          ...state,
          loggedIn: true,
        };
        return newState;
      case "LOGOUT_SUCCESS":
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        newState = { ...state, loggedIn: false };
        return newState;
      case "STORE_USERS":
        newState = {
          ...state,
          users: action.payload,
        };
        return newState;
      case "STORE_WITHDRAWALS":
        newState = {
          ...state,
          withdrawals: action.payload?.sort((a, b) => a.amount - b.amount),
        };
        return newState;
      case "STORE_USER":
        newState = {
          ...state,
          user: action.payload,
        };
        return newState;
      case "STORE_CATEGORIES":
        newCat = action.payload?.sort((a, b) => {
          if (a.issuer < b.issuer) {
            return -1;
          }
        });
        newState = { ...state, categories: newCat };
        return newState;
      case "STORE_CARDS":
        newCards = action.payload?.sort(
          (a, b) => a.date_posted - b.date_posted
        );
        newState = { ...state, cards: newCards };
        return newState;
      case "EDIT_CATEGORY":
        newCat = state.categories.filter((cat) => cat.id !== action.payload.id);
        newCat.push(action.payload);
        newState = {
          ...state,
          categories: newCat.sort((a, b) => {
            if (a.issuer < b.issuer) {
              return -1;
            }
          }),
        };
        return newState;
      case "MODIFY_CARDS":
        newCards = state.cards.filter((card) => card.id !== action.payload.id);
        newCards.push({ ...action.payload, status: action.payload.action });
        newState = {
          ...state,
          cards: newCards.sort((a, b) => a.date_posted - b.date_posted),
        };
        return newState;
      case "MODIFY_WITHDRAWALS":
        newWithdrawals = state.withdrawals.filter(
          (withdrawal) => withdrawal.id !== action.payload.id
        );
        newWithdrawals.push({
          ...action.payload,
          status: action.payload.action,
        });
        newState = {
          ...state,
          withdrawals: newWithdrawals.sort(
            (a, b) => a.date_posted - b.date_posted
          ),
        };
        return newState;
      case "DELETE_CATEGORY":
        newCat = state.categories.filter((cat) => cat.id !== action.payload.id);
        newState = {
          ...state,
          categories: newCat.sort((a, b) => {
            if (a.issuer < b.issuer) {
              return -1;
            }
          }),
        };
        return newState;

      default:
        return;
    }
  };
  const [store, dispatch] = useReducer(reducer, initialState);

  return (
    <Router>
      <Store.Provider value={{ store, dispatch }}>
        <Routes>
          <Route path="*" element={<Error404 />} />

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route path="/403" element={<Error403 />} />
          <Route path="/aDm56" element={<AdmLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sell-giftcard" element={<SelectCard />} />
          <Route path="/request_reset" element={<PasswordRequestForm />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/sell-giftcard/steam" element={<Steam />} />
          <Route path="/sell-giftcard/apple" element={<Apple />} />
          <Route path="/sell-giftcard/vanilla" element={<Vanilla />} />
          <Route path="/sell-giftcard/google" element={<Google />} />
          <Route path="/sell-giftcard/walmart" element={<Walmart />} />
          <Route path="/sell-giftcard/amazon" element={<Amazon />} />
          <Route path="/sell-giftcard/ebay" element={<Ebay />} />
          <Route path="/sell-giftcard/iTunes" element={<Itunes />} />
          <Route path="/sell-giftcard/sephora" element={<Sephora />} />
        </Routes>
      </Store.Provider>
    </Router>
  );
}

export default App;
