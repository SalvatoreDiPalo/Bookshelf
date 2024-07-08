import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LogtoConfig, LogtoProvider } from "@logto/react";
import { Home } from "./pages/home";
import Callback from "./pages/callback";
import { appId, endpoint } from "./utils/const";

const config: LogtoConfig = {
  endpoint: endpoint, // E.g. http://localhost:3001
  appId: appId,
};

function App() {
  return (
    <BrowserRouter>
      <LogtoProvider config={config}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<Callback />} />
          {/*           <Route path="/protected" element={<RequireAuth />}>
            <Route index element={<ProtectedResource />} />
            <Route path="react-query" element={<ReactQuery />} />
            <Route path="organizations" element={<Organizations />} />
          </Route> */}
        </Routes>
      </LogtoProvider>
    </BrowserRouter>
  );
}

export default App;
