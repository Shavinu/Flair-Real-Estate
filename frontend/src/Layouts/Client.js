import { Outlet, useNavigate } from "react-router-dom"
import NavbarUser from "../Components/NavbarUser"
import Footer from "../Components/Footer"
import HomeHero from "../Components/HomeHero"
import { useEffect, useState } from "react";
import moment from "moment";

const Client = () => {
    
    const [user, setUser] = useState(localStorage.getItem('user'));
    const navigate = useNavigate();
  
    useEffect(() => {
      if (user) {
        const userData = JSON.parse(user);
        if (moment().isAfter(moment(userData.expired_at))) {
          localStorage.removeItem('user');
          navigate('/client/home/homepage');
        } else {
          navigate('/auth'); // Add this line to navigate to the Authentication page if user is already logged in
        }
      }
    }, [user, navigate]);
  
  return <div id="body" >
    {/* <!-- fixed-top--> */}
    <NavbarUser />

    {/* <!-- BEGIN Navigation--> */}
    <HomeHero
        cName="hero"
        heroImg="https://www.gannett-cdn.com/presto/2021/06/21/PNAS/1a51b257-cf34-4d30-a2b3-297589a51dab-Bold_Colors-10.JPG?crop=2611,1469,x1,y226&width=1600&height=800&format=pjpg&auto=webp"
        title="Real Estate"
        text="Choose Your New Estate with Real Estate."
        btnClass="hide"
        url="/"
      />
    {/* <!-- END Navigation--> */}

    {/* <!-- BEGIN Content--> */}
    <div className="app-content content">
      <div className="content-wrapper">
        <Outlet />
      </div>
    </div>
    {/* <!-- END Content--> */}

    {/* <!-- START FOOTER LIGHT--> */}
    <footer className="footer footer-static footer-light">
        <Footer />
    </footer>
    {/* <!-- END FOOTER LIGHT--> */}

  </div>
}

export default Client
