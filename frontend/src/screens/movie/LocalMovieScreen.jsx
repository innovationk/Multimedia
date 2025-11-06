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

/*
* Because the server's host blocks video streaming
*/
function LocalMovieScreen() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { showMessage } = useFeedbackMessage();

    const { movieId } = useParams();

    const [row, setRow] = useState({});
    const [videoSrc, setVideoSrc] = useState(null);

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

            import(`../../assets/movies/${_row[`movie.id`]}.mp4`)
                .then((src) => {
                    setVideoSrc(src.default);
                })
                .catch((err) => {
                    console.error("Error loading video:", err);
                });
        }

        setRow(_row);
    };


    return(
    <>
        <h1 className="ikTextCenter">
            {row[`movie.title`]} 
            { row[`movie.language`] !== APITools.Languages.NONE &&
                <>({row[`movie.language`]})</>
            }
        </h1>

        { videoSrc &&
            <video controls width={"100%"} height={"300px"}>
                <source src={videoSrc} type="video/mp4" />
            </video>
        }
    </>
    );
}
export default LocalMovieScreen;