import { Outlet, Link } from "react-router-dom";
import GameContext from "../../context/GameContext";
import { useContext } from "react";

const Layout = () => {
    const { resetGameBoard } = useContext(GameContext); // Call reset function from context

    return (
        <div className="relative">
            {/* Home Button */}
            <Link 
                to="/" 
                onClick={resetGameBoard}  // Reset game state when navigating to home
                className="fixed top-0 left-0 w-full bg-gray-200 shadow-md p-4 flex justify-between items-center">
                🏠 Home
            </Link>

            {/* Render current page */}
            <div className="pt-16">  {/* Adjust padding to match header height */}
            <Outlet />
            </div>
        </div>
    );
};

export default Layout;
