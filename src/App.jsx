import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BusProvider } from './context/BusContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BusProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <AppRoutes />
          </div>
        </BusProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;