import React from "react";
import { useSelector } from "react-redux";
import { Navigate,Outlet } from "react-router-dom";


const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
    
  
  if(isAuthenticated){
    return <Outlet/>
  }
  if(isAuthenticated === false && loading ===false){
    return <Navigate  to='/login'/>
  }
};

export default ProtectedRoute;