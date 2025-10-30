import { Link } from "react-router-dom";

const Navbar = ():React.JSX.Element => {
    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center">
            <Link 
                to="/" 
                className="text-lg font-bold text-blue-600 hover:text-blue-800 transition"
            >
                🏠 Home
            </Link>
        </nav>
    );
};

export default Navbar;