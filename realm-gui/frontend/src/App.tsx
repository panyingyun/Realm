import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/Login';
import { MainPage } from './pages/Main';
import { AddPasswordPage } from './pages/AddPassword';
import { SettingsPage } from './pages/Settings';
import './App.css';

function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/main"
                        element={
                            <ProtectedRoute>
                                <MainPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/add"
                        element={
                            <ProtectedRoute>
                                <AddPasswordPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <SettingsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;
