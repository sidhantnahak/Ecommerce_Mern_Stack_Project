import React from "react";
import { useSelector } from "react-redux";
import { Navigate,Outlet } from "react-router-dom";

const AdminRoute = ({isAdmin}) => {
    const {isAuthenticated,loading } = useSelector((state) => state.user);

    
    if(isAdmin===true && isAuthenticated===false && loading===false){
        return <Navigate to="/login"/>
    }
    if(isAdmin===true){
        return <Outlet/>
    }
}

export default AdminRoute