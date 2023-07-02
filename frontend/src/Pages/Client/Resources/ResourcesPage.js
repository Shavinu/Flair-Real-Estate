import React from "react";
import { ResourceItems } from "../../../paths";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import "./ResourcesPage.css"; 

const ResourcesPage = () => {
  return (
    <div className="resources-page">
      <h1>Resources</h1>
      <div className="contents grid5 mtop">
          <div className="box">
            <Link className="links" to='/MortCal'>
              <div className="icon-box">
              <i className="fa-solid fa-calculator"></i>
              </div>
              <p>Mortgage Calculator</p>
            </Link>
            <Link className="links" to='/BuyProcess'>
              <div className="icon-box">
              <i className="fa-solid fa-a"></i>
              </div>
              <p>Articles</p>
            </Link>
            <Link className="links" to='/PropNews'>
              <div className="icon-box">
              <i className="fa-solid fa-newspaper"></i>
              </div>
              <p>Property News</p>
            </Link>
          </div>
        
        
      </div>
    </div>
  );
};

export default ResourcesPage;
