import Header from "./Header";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const SelectCard = () => {
  return (
    <div>
      <Header />
      <div className="cs-class-2" style={{ marginTop: 20 }}>
        <div className="card-section">
          <legend className="border-bottom">Select card</legend>
          <div className="box text-align">
            <Link to="/sell-giftcard/amazon" className="link">
              <img
                src="https://res.cloudinary.com/wizzle3d/image/upload/v1638108094/imyhg1kerimp87fohyvg.png"
                alt=""
                width="300"
                height="170"
              />
              <div className="description">
                <p>Amazon</p>
              </div>
            </Link>
          </div>
          <div className="box">
            <Link to="/sell-giftcard/google" className="link">
              <img
                src="https://res.cloudinary.com/wizzle3d/image/upload/v1638108130/lb9hjreuwyaa1s7rzjck.png"
                alt=""
                width="300"
                height="170"
              />
              <div className="description">
                <p>Google</p>
              </div>
            </Link>
          </div>
          <div className="box">
            <Link to="/sell-giftcard/apple" className="link">
              <img
                src="https://res.cloudinary.com/wizzle3d/image/upload/v1638563960/apple-not-itunes_bnibhd.svg"
                alt=""
                width="300"
                height="170"
              />
              <div className="description">
                <p>Apple</p>
              </div>
            </Link>
          </div>
          <div className="box">
            <Link to="/sell-giftcard/steam" className="link">
              <img
                src="https://res.cloudinary.com/wizzle3d/image/upload/v1638056756/se0whdvvxvut7mo0gswk.png"
                alt=""
                width="300"
                height="170"
              />
              <div className="description">
                <p>Steam</p>
              </div>
            </Link>
          </div>
          <div className="box">
            <Link to="/sell-giftcard/walmart" className="link">
              <img
                src="https://res.cloudinary.com/wizzle3d/image/upload/v1638564256/ad4559e4897523f102c50c974d33b_1617430003145_abnmlk.png"
                alt=""
                width="300"
                height="170"
              />
              <div className="description">
                <p>Walmart</p>
              </div>
            </Link>
          </div>
          <div className="box">
            <Link to="/sell-giftcard/vanilla" className="link">
              <img
                src="https://res.cloudinary.com/wizzle3d/image/upload/v1638564188/vanilla-gift-logo_pmjs5f.jpg"
                alt=""
                width="300"
                height="170"
              />
              <div className="description">
                <p>Vanilla</p>
              </div>
            </Link>
          </div>
          <div className="box">
            <Link to="/sell-giftcard/sephora" className="link">
              <img
                src="https://res.cloudinary.com/wizzle3d/image/upload/v1638633299/Sephora-Gift-Card-0_lttjrw.jpg"
                alt=""
                width="300"
                height="170"
              />
              <div className="description">
                <p>Sephora</p>
              </div>
            </Link>
          </div>
          <div className="box">
            <Link to="/sell-giftcard/iTunes" className="link">
              <img
                src="https://res.cloudinary.com/wizzle3d/image/upload/v1638633971/kisspng-gift-card-itunes-store-amazon-com-apple-gift-card-5b202b442d0383.9178820515288348841844_uxrqva.jpg"
                alt=""
                width="300"
                height="170"
              />
              <div className="description">
                <p>iTunes</p>
              </div>
            </Link>
          </div>
          <div className="box">
            <Link to="/sell-giftcard/ebay" className="link">
              <img
                src="https://res.cloudinary.com/wizzle3d/image/upload/v1638633723/ebay-4x3_lv2xe0.png"
                alt=""
                width="300"
                height="170"
              />
              <div className="description">
                <p>ebay</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SelectCard;
