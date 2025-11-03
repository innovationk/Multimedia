import React, { createContext, useState, useContext } from 'react';

// Create a context
const FeedbackMessageContext = createContext();

export const FeedbackMessageProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [timestamp, setTimestamp] = useState(Date.now());

    const showMessage = (msg) => {
        setMessage(msg);
        setTimestamp(Date.now());
    };

    return (
        <FeedbackMessageContext.Provider value={{ message, timestamp, showMessage }}>
            {children}
        </FeedbackMessageContext.Provider>
    );
};

export const useFeedbackMessage = () => useContext(FeedbackMessageContext);