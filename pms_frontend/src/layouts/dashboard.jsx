import {Routes, Route, Outlet} from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import {useEffect, useState} from "react";
import {decodeToken} from "@/utils/helpers.js";

export function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // NEW
    const [controller, dispatch] = useMaterialTailwindController();
    const { sidenavType } = controller;

    useEffect(() => {
        const data = decodeToken();
        setUserData(data);
        setLoading(false); // Wait until token is decoded
    }, []);

    if (loading) return null; // Or show a spinner

    if (!userData) {
        window.location = "/auth/sign-in";
        return null;
    }

    return (
        <div className="min-h-screen bg-blue-gray-50/50">
            <Sidenav
                routes={routes}
                brandImg={
                    sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
                }
                brandName={"PMS"}
                user={userData}
            />
            <div className="p-4 xl:ml-80">
                <DashboardNavbar />
                <Configurator />
                <IconButton
                    size="lg"
                    color="white"
                    className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
                    ripple={false}
                    onClick={() => setOpenConfigurator(dispatch, true)}
                >
                    <Cog6ToothIcon className="h-5 w-5" />
                </IconButton>
                <Outlet />
                <div className="text-blue-gray-600">
                    <Footer />
                </div>
            </div>
        </div>
    );
}


Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
