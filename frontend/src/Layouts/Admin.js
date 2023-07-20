import { Outlet, useNavigate } from "react-router-dom"
import NavbarUser from "../Components/NavbarUser"
import Sidebar from "../Components/Sidebar"
import { useEffect, useState } from "react";
import moment from "moment";

const Admin = () => {
  const [user, setUser] = useState(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(user);
    if (moment().isAfter(moment(userData.expired_at))) {
      localStorage.removeItem('user');
      navigate('/');
      return
    }
  }, [user]);

  return <div id="body" className="vertical-layout vertical-menu-modern 2-column navbar-floating footer-static menu-expanded" data-menu="vertical-menu-modern">
    {/* <!-- fixed-top--> */}
    

    {/* <!-- BEGIN Navigation--> */}
    <Sidebar homeUrl="/" />
    {/* <!-- END Navigation--> */}

    {/* <!-- BEGIN Content--> */}
    <div className="app-content content">
      <div>
        <Outlet />
      </div>
    </div>
    {/* <!-- END Content--> */}

    {/* <!-- START FOOTER LIGHT--> */}
    {/* <footer className="footer footer-static footer-light"> */}
    {/* </footer> */}
    {/* <!-- END FOOTER LIGHT--> */}

  </div>
}

export default Admin
