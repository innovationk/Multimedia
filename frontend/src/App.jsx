import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LocalStorageTools from './tools/LocalStorageTools';
import ScrollToTop from './tools/ScrollToTop';
import RedirectComponent from './RedirectComponent';
import LoginScreen from './screens/account/LoginScreen';

const ProtectedRoute = ({ children }) => {
    const [authState, setAuthState] = useState(0);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        if (await LocalStorageTools.isAccountValid()) {
            setAuthState(1);
        } else {
            setAuthState(-1);
        }
    };

    if (authState < 0) {
        return <Navigate to="/" replace />;
    } else if (authState > 0) {
        return children;
    } else {
        return <></>;
    }
};

function App() {

    return (
        <Router>
            <ScrollToTop />
            
            <Routes>
                <Route path="/" element={
                    <MainStructure>
                        <RedirectComponent />
                    </MainStructure>
                } />

                <Route path={`/login`} element={
                    <MainStructure>
                        <LoginScreen />
                    </MainStructure>
                } />

            </Routes>
        </Router>
    );
}
export default App;