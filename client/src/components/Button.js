const Button = ({ title, onClick }) => {
  return (
    <div style={{ padding: 10 }}>
      <button className="btn btn-dark" onClick={onClick}>
        {title}
      </button>
    </div>
  );
};

export default Button;
