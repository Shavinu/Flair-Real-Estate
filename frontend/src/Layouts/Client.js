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

    <HomeHero
        cName="hero"
        heroImg="https://www.gannett-cdn.com/presto/2021/06/21/PNAS/1a51b257-cf34-4d30-a2b3-297589a51dab-Bold_Colors-10.JPG?crop=2611,1469,x1,y226&width=1600&height=800&format=pjpg&auto=webp"
        title="Real Estate"
        text="Choose Your New Estate with Real Estate."
        btnClass="hide"
        url="/"
      />

    <Outlet />
    {/* <!-- END Content--> */}

    {/* <!-- START FOOTER LIGHT--> */}
    <Footer />
    {/* <!-- END FOOTER LIGHT--> */}

  </div>
}

export default Client
