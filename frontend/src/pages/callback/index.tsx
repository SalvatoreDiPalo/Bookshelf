import { useRequest } from "@/hooks/useRequest";
import { UserDTO } from "@/models/UserDTO";
import { useHandleSignInCallback } from "@logto/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  const { data, fetchData } = useRequest<UserDTO>(
    {
      url: "/users/profile",
    },
    false,
  );

  const { isLoading, isAuthenticated } = useHandleSignInCallback(() => {
    console.log("IsAuthenticated", isAuthenticated);
    fetchData();
  });

  useEffect(() => {
    if (data) {
      console.log("Data", data);
      navigate("/");
    }
  }, [data, navigate]);

  return isLoading ? <p>Redirecting...</p> : null;
};

export default Callback;
