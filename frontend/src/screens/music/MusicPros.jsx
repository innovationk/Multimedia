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
import APIImage from "../../tools/APIImage";


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
                    <div className="ikRow " key={`grid_row_${iRow}`}>

                        {[...Array(4)].map((_, iCol) => {
                            const iComponent = iRow * 4 + iCol;

                            return (
                                <div className="ikCol25" 
                                    key={`grid_row_${iRow}_col_${iCol}`}
                                >
                                    {rows[iComponent] &&
                                    <NavLink to={`/music/artists/${rows[iComponent][`professional.id`]}`}
                                        className="musicPro"
                                    >
                                        <APIImage path={`/api/professionals/${rows[iComponent][`professional.id`]}/image`}
                                            alt={rows[iComponent][`professional.name`]}
                                        />
                                        <div className="ikPaddingH10">
                                            <h2 className="ikMarginT10">
                                                {rows[iComponent][`professional.name`]}
                                            </h2>
                                        </div>
                                    </NavLink>
                                    }
                                </div>
                            );
                        })}

                    </div>
                ))}
            </div>
        }
    </>
    );
}
export default MusicPros;