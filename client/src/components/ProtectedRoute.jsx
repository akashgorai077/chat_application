import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {

    const {isAuthenticated, screenLoading  } = useSelector(
        (state)=>state.userReducer); 
    const navigate = useNavigate();

    useEffect(()=>{
        console.log(isAuthenticated,screenLoading)
        if(!screenLoading && !isAuthenticated ) navigate('/');
        }, [isAuthenticated,screenLoading]);
  
 
    return children;
};

export default ProtectedRoute;