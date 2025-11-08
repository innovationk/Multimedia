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
function LocalVideoScreen() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { showMessage } = useFeedbackMessage();

    const { videoId } = useParams();

    const [row, setRow] = useState({});
    const [videoSrc, setVideoSrc] = useState(null);

    useEffect(() => {
        fetchRow();
    }, []);

    const fetchRow = async () => {
        let _row = {};

        const response = await APITools.send({
            method: APITools.Methods.GET,
            path: `/api/videos/${videoId}`
        });
        if (response.apiStatus === 200) {
            _row = response.row;

            import(`../../assets/videos/${_row[`video.id`]}.mp4`)
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
            {row[`video.title`]} 
            { row[`video.language`] !== APITools.Languages.NONE &&
                <>({row[`video.language`]})</>
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
export default LocalVideoScreen;