import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <div className="relative">
            {/* Home Button */}
            <Link 
                to="/" 
                className="fixed top-0 left-0 w-full bg-gray-200 shadow-md p-4 flex justify-between items-center">
                🏠 Home
            </Link>

            {/* Render current page */}
            <Outlet />
        </div>
    );
};

export default Layout;
