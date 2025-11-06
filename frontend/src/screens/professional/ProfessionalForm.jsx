import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { firtsLetterUppercase, generateSlug } from "../../tools/TextTools";
import { useFeedbackMessage } from "../../theme/FeedbackMessageContext";
import APITools from "../../tools/APITools";
import EventBus from '../../tools/EventBus';
import Modal from '../../theme/Modal';
import LocalStorageTools from "../../tools/LocalStorageTools";
import CssTools from "../../tools/CssTools";
import Mandatory from "../../components/Mandatory";
import AppEvents from "../../theme/AppEvents";


function ProfessionalForm({
    initRow = {},
    action = APITools.Methods.POST,
    onSaveDB = (() => { }),
}) {
    const { t, i18n } = useTranslation();
    const { showMessage } = useFeedbackMessage();
    const navigate = useNavigate();

    const ACCOUNT = LocalStorageTools.readData({ key: "account" });

    const [name, set_name] = useState("");
    const [surname, set_surname] = useState("");

    useEffect(() => {
        if(initRow[`professional.id`]) {
            set_name(initRow[`professional.name`]);
            set_surname(initRow[`professional.surname`]);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let inputs = {
            token_id: ACCOUNT.token_id,
            token: ACCOUNT.token,
            name: name,
            surname: surname,
            music: 1,
        };

        let path = `/api/professionals`;
        if(action === APITools.Methods.PUT || action === APITools.Methods.DELETE) {
            path += `/${initRow['professional.id']}`
        }
        const response = await APITools.send({
            method: action,
            path: path,
            body: inputs
        });
        if (response.apiStatus >= 200 && response.apiStatus < 300) {
            EventBus.dispatch(AppEvents.MusicNewArtist, { name: name });
            onSaveDB();
        } else {
            showMessage(firtsLetterUppercase(t('wrong_inputs')));
        }
    };


    return (
        <>
            <h2>
                {firtsLetterUppercase(t('artist'))}
            </h2>
            
            { (action === APITools.Methods.POST || action === APITools.Methods.PUT) &&
            <form onSubmit={handleSubmit}>
                <div className="ikMarginT20">
                    <div className="ikMarginB4">
                        <label>
                            {firtsLetterUppercase(t('name'))} <Mandatory />
                        </label>
                        <input type="text" required
                            value={name}
                            onChange={(e) => { set_name(e.target.value || ""); }}
                            placeholder={firtsLetterUppercase(t('name'))}
                            className="ikW100"
                        />
                    </div>
                </div>

                <div className="ikMarginT20">
                    <div className="ikMarginB4">
                        <label>
                            {firtsLetterUppercase(t('surname'))}
                        </label>
                        <input type="text"
                            value={surname}
                            onChange={(e) => { set_surname(e.target.value || ""); }}
                            placeholder={firtsLetterUppercase(t('surname'))}
                            className="ikW100"
                        />
                    </div>
                </div>

                <div className="ikMarginT20">
                    <button type='submit' className='button1 ikW100'>
                        {firtsLetterUppercase(t('save'))}
                    </button>
                </div>
            </form>
            }

            { action === APITools.Methods.DELETE &&
                <form onSubmit={handleSubmit}>
                    <div className="ikMarginT20">
                        {firtsLetterUppercase(t('ask_confirm_delete'))}
                    </div>
                    <div className="ikMarginT20">
                        {name} {surname}
                    </div>
                    <div className="ikMarginT20">
                        <button type='submit' className='buttonDelete ikW100 ikPaddingV10 ikPaddingH10'>
                            {firtsLetterUppercase(t('delete'))}
                        </button>
                    </div>
                </form>
            }
        </>
    )
}
export default ProfessionalForm;