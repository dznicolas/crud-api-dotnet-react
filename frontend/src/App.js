import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PessoaList from './components/PessoaList';
import Navbar from './components/Navbar';

function App() {
    return (
        <AuthProvider>
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <div className="container mx-auto px-4 py-8 max-w-7xl">
                        <PessoaList />
                    </div>
                </div>
            </ProtectedRoute>
        </AuthProvider>
    );
}

export default App;

