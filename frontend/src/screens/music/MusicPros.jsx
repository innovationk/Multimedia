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


function MusicPros({
    firstChar="a"
}) {
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
            path: `/api/professionals`,
            query: {
                and_music_eq: 1,
                and_name_like: `${firstChar}%`,
                and_state_like: APITools.RowsStates.ACTIVE,
                sort: 'name_ASC',
                elements_per_page: Number.MAX_SAFE_INTEGER
            }
        });
        if (response.apiStatus === 200) {
            _rows = response.rows;
        }

        setRows(_rows);
    };


    return(
    <>
        { rows.length > 0 &&
            <div className="musicSection">
                <div className="h1">{firstChar.toUpperCase()}</div>

                {[...Array(rows.length)].map((_, iRow) => (
                    <div className="ikRow" key={`grid_row_${iRow}`}>

                        {[...Array(4)].map((_, iCol) => {
                            const iComponent = iRow * 4 + iCol;
                            if (rows[iComponent]) {

                                return (
                                    <div className="ikCol" key={`grid_row_${iRow}_col_${iCol}`}>
                                        {rows[iComponent][`professional.name`]}
                                        
                                    </div>
                                );

                            }
                        })}

                    </div>
                ))}
            </div>
        }
    </>
    );
}
export default MusicPros;