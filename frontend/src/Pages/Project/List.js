//import required modules
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ConfirmModal, ContentHeader, Dropdown } from "../../Components";

const List = () => {
    return <>
        <ContentHeader headerTitle="Project List"
        breadcrumb={[
            { name: "Home", link: "/" },
            { name: "Projects", active: true },
        ]}
        options={<Link className="btn btn-primary waves-effect waves-light" to="/projects/create">Create Project</Link>}
        />
    </>
}

export default List
