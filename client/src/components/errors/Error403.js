import Header from "../Header";

const Error403 = () => {
  return (
    <div
      className="container content-section text-align"
      style={{ marginTop: 200 }}
    >
      <div>
        <h1 style={{ fontSize: 100 }}>403</h1>
        <p>You do not have permission for this request</p>
      </div>
    </div>
  );
};

export default Error403;
