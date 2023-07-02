import React from "react";
import { ResourceItems } from "../../../paths";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import "./ResourcesPage.css"; 

const ResourcesPage = () => {
  return (
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
  );
};

export default ResourcesPage;
