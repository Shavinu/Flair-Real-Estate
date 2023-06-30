import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import './TabsCss.css'
import AboutCms from "./AboutCms";
import ContactCms from "./ContactCms";
import ArticlesCms from "./ArticlesCms";
import NewsCms from "./NewsCms";

function TabView() {
    const [index, setIndex] = useState(0);
    return (
        <div className="Tabs">
            <div className="tabList">
                <div className={index === 0 ? "active" : "tabHeader"} onClick={() => { setIndex(0) }}>About</div>
                <div className={index === 1 ? "active" : "tabHeader"} onClick={() => { setIndex(1) }}>Contact</div>
                <div className={index === 2 ? "active" : "tabHeader"} onClick={() => { setIndex(2) }}>Articles</div>
                <div className={index === 3 ? "active" : "tabHeader"} onClick={() => { setIndex(3) }}>News</div>
            </div>
            <div className="tabContent" hidden={index !== 0}>
                <AboutCms />
            </div>
            <div className="tabContent" hidden={index !== 1}>
                <ContactCms />
            </div>
            <div className="tabContent" hidden={index !== 2}>
                <ArticlesCms />
            </div>
            <div className="tabContent" hidden={index !== 3}>
                <NewsCms />
            </div>
        </div >
    )
}
export default TabView;