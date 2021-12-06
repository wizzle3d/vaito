import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdmLogin from "./AdmLogin";
import Admin from "./Admin";
import React, { useReducer } from "react";
import Category from "./Category";

export const Bank = React.createContext();

const initialState = {
  categories: [],
  users: [],
};

const Context = () => {
  let newState;
  const reducer = (state, action) => {
    switch (action.type) {
      case "STORE_USERS":
        newState = {
          ...state,
          users: action.payload,
        };
        return newState;
      case "STORE_CATEGORIES":
        newState = { ...state, categories: action.payload };
        return newState;
      default:
        return;
    }
  };
  const [store, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <Bank.Provider value={{ store, dispatch }}>
        <Admin />
        <Category />
      </Bank.Provider>
    </div>
  );
};

export default Context;
