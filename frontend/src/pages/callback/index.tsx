import { useHandleSignInCallback, useLogto } from "@logto/react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const { getAccessToken } = useLogto();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useHandleSignInCallback(() => {
    console.log("IsAuthenticated", isAuthenticated);

    getAccessToken("http://localhost:3001").then((token?: string) => console.log("token callback", token));
    navigate("/");
  });

  return isLoading ? <p>Redirecting...</p> : null;
};

export default Callback;
