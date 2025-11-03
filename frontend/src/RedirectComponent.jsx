import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectComponent = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let defaultLink = `/login`;
        navigate(defaultLink);
    }, [navigate]);

    return null;
};

export default RedirectComponent;
