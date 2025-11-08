import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { firtsLetterUppercase, generateSlug } from "../../tools/TextTools";
import { useFeedbackMessage } from "../../theme/FeedbackMessageContext";
import APITools from "../../tools/APITools";
import EventBus from '../../tools/EventBus';
import AppEvents from '../../theme/AppEvents';
import LocalStorageTools from "../../tools/LocalStorageTools";
import CssTools from "../../tools/CssTools";
import APIImage from "../../tools/APIImage";


function SongPlayer({
    path
}) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { showMessage } = useFeedbackMessage();

    const componentRef = useRef(null);
    const [audioUrl, setAudioUrl] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchAudio();
                    observer.disconnect();
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            }
        );

        if (componentRef.current) {
            observer.observe(componentRef.current);
        }

        return () => {
            if (componentRef.current) {
                observer.unobserve(componentRef.current);
            }
        };
    }, [path]);

    const fetchAudio = async () => {
        if (path.length > 0) {
            const response = await APITools.fetchMedia({ path: path });
            setAudioUrl(response.mediaURL);
        }
    };


    return(
    <div ref={componentRef}>
        {audioUrl &&
            <audio controls src={audioUrl}>
                Your browser does not support the audio element.
            </audio>
        }
    </div>
    );
}
export default SongPlayer;