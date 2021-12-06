import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Header />
      <section id="showcase">
        <p>.</p>
        <div className="container">
          <h1>Sell Your Giftcards At Amazing Rates</h1>
          <p>
            Convert your Giftcards to naira easily and get an instant payment.
          </p>
          <Link to="/sell-giftcard">
            <button className="btn btn-success">Sell Giftcard</button>
          </Link>
        </div>
      </section>
      <section id="banner">Reviews from our users</section>
      <div className="cs-class">
        <div className="review-box">
          <img
            alt=""
            src="https://res.cloudinary.com/wizzle3d/image/upload/v1638612696/ztkp9qftpo8gmpuuueao.jpg"
            className="rounded-circle review-img"
          />
          <p style={{ fontSize: 35, marginBottom: 0 }}>John Doe</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.{" "}
          </p>
        </div>
        <div className="review-box">
          <img
            alt=""
            src="https://res.cloudinary.com/wizzle3d/image/upload/v1637699597/vaito/default_ni4q8g.jpg"
            className="rounded-circle review-img"
          />
          <p style={{ fontSize: 35, marginBottom: 0 }}>John Doe</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.{" "}
          </p>
        </div>
        <div className="review-box">
          <img
            alt=""
            src="https://res.cloudinary.com/wizzle3d/image/upload/v1638310218/bqffhheh7nfgqg1t9kgy.jpg"
            className="rounded-circle review-img"
          />
          <p style={{ fontSize: 35, marginBottom: 0 }}>John Doe</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.{" "}
          </p>
        </div>
        <div className="review-box">
          <img
            alt=""
            src="https://res.cloudinary.com/wizzle3d/image/upload/v1638196506/wccyedscmjlaobkqw00g.jpg"
            className="rounded-circle review-img"
          />
          <p style={{ fontSize: 35, marginBottom: 0 }}>John Doe</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.{" "}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
