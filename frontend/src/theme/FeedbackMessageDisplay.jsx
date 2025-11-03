import { useEffect, useState } from 'react';
import { useFeedbackMessage } from './FeedbackMessageContext';
import DateTools from '../tools/DateTools';

const FeedbackMessageDisplay = () => {
    const { message, timestamp } = useFeedbackMessage();
    const [isVisible, setIsVisible] = useState(false);
    const [previousTimestamp, setPreviousTimestamp] = useState(0);

    useEffect(() => {
        setIsVisible(false);
        setPreviousTimestamp(timestamp);
    }, [timestamp]);

    useEffect(() => {
        if (message.length > 0) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [previousTimestamp]);


    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: "80vw",
                zIndex: 2000,
                transition: "opacity 0.5s ease-in-out",
                opacity: `${isVisible ? 1 : 0}`,
                display: `${isVisible ? "block" : "none"}`,
                borderRadius: "16px",
                padding: "16px",
                backgroundColor: "white",
                border: "1px solid black"
            }}
        >
            {DateTools.timestampToDateString({ timestamp: timestamp, showYear: true, showHoursAndMinutes: true, showSeconds: true })}
            : {message}
        </div>
    );
};

export default FeedbackMessageDisplay;
