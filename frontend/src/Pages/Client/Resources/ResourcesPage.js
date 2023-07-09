import React from "react";
import { ResourceItems } from "../../../paths";
import { Link } from "react-router-dom";
import "./ResourcesPage.css"; 
import HomeHero from "../../../Components/HomeHero";

const ResourcesPage = () => {
  return ( <>
    {/* <!-- BEGIN Navigation--> */}
    <HomeHero
      cName="villain"
      heroImg="https://www.gannett-cdn.com/presto/2021/06/21/PNAS/1a51b257-cf34-4d30-a2b3-297589a51dab-Bold_Colors-10.JPG?crop=2611,1469,x1,y226&width=1600&height=800&format=pjpg&auto=webp"
      title="Real Estate"
      text="Choose Your New Estate with Real Estate."
      btnClass="hide"
      url="/"
    />
    {/* <!-- END Navigation--> */}
    <div className="resources-page">
      <h1>Resources</h1>
      <div className="contents grid3 mtop">
          <div className="box">
            <Link className="links" to='/MortCal'>
              <i className="fa-solid fa-calculator"></i>
              Mortgage Calculator
            </Link>
            </div>
            <div className="box">
            <Link className="links" to='/BuyProcess'>
              <i className="fa-solid fa-a"></i>
              Articles
            </Link>
            </div>
            <div className="box">
            <Link className="links" to='/PropNews'>
              <i className="fa-solid fa-newspaper"></i>
              Property News
            </Link>
          </div> 
      </div>
    </div>
    </>
  );
};

export default ResourcesPage;
