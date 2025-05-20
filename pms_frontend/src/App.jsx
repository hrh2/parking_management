import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import routes from "@/routes.jsx";
import PopupView from "@/widgets/cards/PopupView.jsx";
import {decodeToken} from "@/utils/helpers.js";
import {useEffect, useState} from "react";

function App() {

    const token = localStorage.getItem("pms_auth_token");
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const data = decodeToken(token);
        setUserData(data);
    }, [token]);

    const userRole = () => {
        return userData && userData.role;
    }

  return (
      <>
        <PopupView />
    <Routes>


        {/* Authentication */}
        <Route path="/auth" element={<Auth />} >
            {routes.map(
                ({ layout, pages }) =>
                    layout === "auth" &&
                    pages.map(({ path, element }) => (
                        <Route exact path={`/auth/${path}`} element={element} />
                    ))
            )}
        </Route>

        {/* Admin DashBoard */}
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/auth/sign-in" />} >
                {routes.map(
                    ({ layout, pages }) =>
                        layout === userRole() &&
                        pages.map(({ path, element }) => (
                            <Route  path={path} element={element} />
                    ))
                )}
        </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
  );
}

export default App;
