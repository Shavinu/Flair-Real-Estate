import { Outlet, useNavigate } from "react-router-dom"
import NavbarUser from "../Components/NavbarUser"
import Footer from "../Components/Footer"
import HomeHero from "../Components/HomeHero"
import { useEffect, useState } from "react";
import moment from "moment";

const Client = () => {
  
  return <div id="body" >
    {/* <!-- fixed-top--> */}
    <NavbarUser />

    <Outlet />
    {/* <!-- END Content--> */}

    {/* <!-- START FOOTER LIGHT--> */}
    <Footer />
    {/* <!-- END FOOTER LIGHT--> */}

  </div>
}

export default Client
