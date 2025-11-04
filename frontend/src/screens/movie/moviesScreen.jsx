import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { firtsLetterUppercase, generateSlug } from "../../tools/TextTools";
import { useFeedbackMessage } from "../../theme/FeedbackMessageContext";
import APITools from "../../tools/APITools";
import EventBus from '../../tools/EventBus';
import AppEvents from '../../theme/AppEvents';
import LocalStorageTools from "../../tools/LocalStorageTools";
import CssTools from "../../tools/CssTools";
import DownloadButton from "./DownloadButton";


function MoviesScreen() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { showMessage } = useFeedbackMessage();

    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchRows();
    }, []);

    const fetchRows = async () => {
        let _rows = [];

        const response = await APITools.send({
            method: APITools.Methods.GET,
            path: `/api/movies`,
            query: {
                sort: 'movie.title_ASC',
                elements_per_page: 20
            }
        });
        if (response.apiStatus === 200) {
            _rows = response.rows;
        }

        setRows(_rows);
    };


    return(
    <>
        <h1 className="ikTextCenter">
            {firtsLetterUppercase(t('movies'))}
        </h1>

        <div className="ikMarginT20">
            {rows.map((row, index) => (
                <div key={`row_${index}`} className="ikRow">
                    <div className="ikCol">
                        <NavLink to={`/movies/${row[`movie.id`]}`}>{row[`movie.title`]} ({row[`movie.language`]})</NavLink>
                    </div>
                    <div className="ikCol">
                        <DownloadButton downloadUrl={`${APITools.getURL({})}/api/movies/${row[`movie.id`]}/download`}
                            title={generateSlug(row[`movie.title`])}
                        />
                    </div>
                </div>
            ))}
        </div>
    </>
    );
}
export default MoviesScreen;