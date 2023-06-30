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
        {ResourceItems.map((item, index) => (
          <div className="box" key={index}>
            <Link className="links" to={item.url}>
              <div className="icon-box">
              <i className={item.icon}></i>
              </div>
              <p>{item.name}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;
