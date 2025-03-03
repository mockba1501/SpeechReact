import { useNavigate } from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button 
            onClick={() => navigate("/")} 
            className="mt-4 rounded-lg bg-blue-500 px-6 py-2 text-white shadow-md transition hover:bg-blue-600"
        >
            ⬅ Back to Main Menu
        </button>
    );
};

export default BackButton;
