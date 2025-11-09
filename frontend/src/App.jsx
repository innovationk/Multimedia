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
import VideosScreen from './screens/video/VideosScreen';
// import ExternalMovieScreen from './screens/movie/ExternalMovieScreen';
import LocalMovieScreen from './screens/video/LocalMovieScreen';
import MusicScreen from './screens/music/MusicScreen';
import ProAlbums from './screens/music/ProAlbums';
import BooksScreen from './screens/book/BooksScreen';

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

                <Route path={`/books`} element={
                    <MainStructure>
                        <ProtectedRoute>
                            <BooksScreen />
                        </ProtectedRoute>
                    </MainStructure>
                } />

                <Route path={`/music`} element={
                    <MainStructure>
                        <ProtectedRoute>
                            <MusicScreen />
                        </ProtectedRoute>
                    </MainStructure>
                } />
                <Route path={`/music/artists/:professionalId/albums`} element={
                    <MainStructure>
                        <ProtectedRoute>
                            <ProAlbums />
                        </ProtectedRoute>
                    </MainStructure>
                } />

                <Route path={`/videos`} element={
                    <MainStructure>
                        <ProtectedRoute>
                            <VideosScreen />
                        </ProtectedRoute>
                    </MainStructure>
                } />
                <Route path={`/movies/:movieId`} element={
                    <MainStructure>
                        <ProtectedRoute>
                            {/* <ExternalMovieScreen /> */}
                            <LocalMovieScreen />
                        </ProtectedRoute>
                    </MainStructure>
                } />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}
export default App;