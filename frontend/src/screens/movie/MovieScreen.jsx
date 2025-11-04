import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { firtsLetterUppercase } from "../../tools/TextTools";
import { useFeedbackMessage } from "../../theme/FeedbackMessageContext";
import APITools from "../../tools/APITools";
import EventBus from '../../tools/EventBus';
import AppEvents from '../../theme/AppEvents';
import LocalStorageTools from "../../tools/LocalStorageTools";
import CssTools from "../../tools/CssTools";


function MovieScreen() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { showMessage } = useFeedbackMessage();

    const { movieId } = useParams();

    const [row, setRow] = useState({});
    const videoRef = useRef(null);

    useEffect(() => {
        fetchRows();
    }, []);

    const fetchRows = async () => {
        let _row = {};

        const response = await APITools.send({
            method: APITools.Methods.GET,
            path: `/api/movies/${movieId}`
        });
        if (response.apiStatus === 200) {
            _row = response.row;
        }

        setRow(_row);
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.src = `${APITools.getURL({})}/api/movies/${movieId}/stream`;
            videoRef.current.load();
        }
    }, [videoRef]);


    return(
    <>
        <h1 className="ikTextCenter">
            {row[`movie.title`]} ({row[`movie.language`]})
        </h1>

        <video
            ref={videoRef}
            controls
            width={"100%"}
            height={"300px"}
        />
    </>
    );
}
export default MovieScreen;