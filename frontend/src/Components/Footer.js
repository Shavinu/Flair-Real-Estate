import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-top">
        <div>
          <h1>Real Estate</h1>
        </div>
        <div>
          <a href="/">
            <i className="fa-brands fa-facebook-square"></i>
          </a>
          <a href="/">
            <i className="fa-brands fa-instagram-square"></i>
          </a>
          <a href="/">
            <i className="fa-brands fa-twitter-square"></i>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          <h4>Links</h4>
          <a href="/HomePage">Home</a>
          <a href="/AboutUs">About Us</a>
          <a href="/ListingPage">NSW Listing</a>
          <a href="/MortCal">Mortgage Calculator</a>
          <a href="/BuyProcess">Articles</a>
          <a href="/PropNews">Property</a>
          <a href="/Contact">Contact Us</a>
        </div>
        <div>
          <h4>Contact Details</h4>
          <h5>Address: </h5>
          <h5>Phone Number: </h5>
          <h5>Email: </h5>
        </div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Footer;
