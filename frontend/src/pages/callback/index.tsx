import { useAppContext } from "@/context/AppProvider";
import { useHandleSignInCallback } from "@logto/react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();
  const { signIn } = useAppContext();

  const { isLoading, isAuthenticated } = useHandleSignInCallback(() => {
    console.log("callback IsAuthenticated: ", isAuthenticated);
    //fetchData();
    signIn!();
    navigate("/home");
  });
  return isLoading ? <p>Redirecting...</p> : null;
};

export default Callback;
