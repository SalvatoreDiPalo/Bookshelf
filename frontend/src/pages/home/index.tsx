import { UserInfoResponse, useLogto } from "@logto/react";
import { useEffect, useState } from "react";
import { baseUrl, redirectUrl } from "../../utils/const";

export const Home = () => {
  const { isAuthenticated, signIn, signOut, fetchUserInfo, getAccessToken } =
    useLogto();
  const [user, setUser] = useState<UserInfoResponse>();
  const [accessToken, setAccessToken] = useState("ciao");

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const userInfo = await fetchUserInfo();
        const token = await getAccessToken("http://localhost:3001");
        setAccessToken(token ?? "");
        setUser(userInfo);
      }
    })();

  }, [fetchUserInfo, getAccessToken, isAuthenticated]);


  return (
    <div>
      <h3>Logto React sample</h3>
      {!isAuthenticated && (
        <>
          <button
            type="button"
            onClick={() => {
              void signIn(redirectUrl);
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              void signIn({
                redirectUri: redirectUrl,
                interactionMode: "signUp",
              });
            }}
          >
            Registrati
          </button>
        </>
      )}
      {isAuthenticated && (
        <button
          type="button"
          onClick={() => {
            void signOut(baseUrl);
          }}
        >
          Disconnettiti
        </button>
      )}
      {isAuthenticated && user && accessToken && (
        <>
          <p>AccesToken: {accessToken}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(user).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>
                    {typeof value === "string" ? value : JSON.stringify(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
