import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [serverRes, setServerRes] = useState({});
  const token = searchParams.get("token");
  useEffect(() => {
    const sendToken = async (token) => {
      const res = await fetch(`/email_verify/${token}`);
      const data = await res.json();
      setServerRes(data);
      return data;
    };
    sendToken(token);
  }, [token]);

  return (
    <div>
      <Header />
      <div className="content-section">
        <legend className="border-bottom mb-4">Verify your email.</legend>
        <div className="form-group">
          <p
            className={
              (serverRes.error && "alert alert-danger form-ctrl input") ||
              (serverRes.response && "alert alert-success form-ctrl input")
            }
          >
            {serverRes.response ? serverRes.response : serverRes.error}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
