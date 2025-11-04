import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LocalStorageTools from './tools/LocalStorageTools';
import ScrollToTop from './tools/ScrollToTop';
import RedirectComponent from './RedirectComponent';
import MainStructure from './theme/MainStructure';
import LoginScreen from './screens/account/LoginScreen';
import LogoutScreen from './screens/account/LogoutScreen';
import HomeScreen from './screens/home/HomeScreen';
import MoviesScreen from './screens/movie/moviesScreen';
import MovieScreen from './screens/movie/MovieScreen';

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
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) {
        // TODO: loading screen
        return <div>{t("loading")}...</div>;
    }

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
                <Route path={`/logout`} element={
                    <MainStructure>
                        <LogoutScreen />
                    </MainStructure>
                } />

                <Route path={`/home`} element={
                    <MainStructure>
                        <ProtectedRoute>
                            <HomeScreen />
                        </ProtectedRoute>
                    </MainStructure>
                } />

                <Route path={`/movies`} element={
                    <MainStructure>
                        <ProtectedRoute>
                            <MoviesScreen />
                        </ProtectedRoute>
                    </MainStructure>
                } />
                <Route path={`/movies/:movieId`} element={
                    <MainStructure>
                        <ProtectedRoute>
                            <MovieScreen />
                        </ProtectedRoute>
                    </MainStructure>
                } />

            </Routes>
        </Router>
    );
}
export default App;