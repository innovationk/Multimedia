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


function MusicScreen() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { showMessage } = useFeedbackMessage();

    useEffect(() => {
    }, []);


    return(
    <>
        <h1 className="ikTextCenter">
            {firtsLetterUppercase(t('music'))}
        </h1>

        <div className="ikMarginT20">
            <div className="ikMarginT40">
                <h2>0-9</h2>
            </div>
            
            {[...Array(26)].map((_, iLetter) => {
                const letter = (iLetter+10).toString(36);

                return (
                    <div key={`row_${iLetter}`} className="ikMarginT40">
                        <h2>{letter.toUpperCase()}</h2>
                    </div>
                )
            })}
        </div>
    </>
    );
}
export default MusicScreen;