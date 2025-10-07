import { Typography } from "@material-tailwind/react";
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        if (window.confirm('Deseja realmente sair?')) {
            logout();
        }
    };

    return (
        <nav className="bg-blue-600 shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Typography variant="h3" color="white" className="font-bold">
                    Projeto - CRUD
                </Typography>
                
                <div className="flex items-center space-x-4 text-white">
                    <span className="text-sm">
                        Olá, <strong>{user?.username}</strong>
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                        Sair
                    </button>
                </div>
            </div>
        </nav>
    );
}
