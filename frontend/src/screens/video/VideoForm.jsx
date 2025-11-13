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
import Mandatory from "../../tools/Mandatory";
import AppEvents from "../../theme/AppEvents";


function VideoForm({
    initRow = {},
    action = APITools.Methods.POST,
    onSaveDB = (() => { }),
}) {
    const { t, i18n } = useTranslation();
    const { showMessage } = useFeedbackMessage();
    const navigate = useNavigate();

    const ACCOUNT = LocalStorageTools.readData({ key: "account" });

    const [title, set_title] = useState("");
    const [language, set_language] = useState("");

    useEffect(() => {
        if(initRow[`video.id`]) {
            set_title(initRow[`video.title`]);
            set_language(initRow[`video.language`]);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let path = `/api/videos`;
        if(action === APITools.Methods.PUT || action === APITools.Methods.DELETE) {
            path += `/${initRow['video.id']}`;
        }

        let formData = {
            token_id: ACCOUNT.token_id,
            token: ACCOUNT.token,
        };
        if(action === APITools.Methods.POST || action === APITools.Methods.PUT) {
            formData.title = title;
            formData.language = language;
        }

        const response = await APITools.send({
            method: action,
            path: path,
            body: formData
        });
        if (response.apiStatus >= 200 && response.apiStatus < 300) {

            // EventBus.dispatch(AppEvents.Videos, {});
            onSaveDB();

        } else {
            showMessage(firtsLetterUppercase(t('wrong_inputs')));
        }
    };


    return (
        <>
            <h2>
                {firtsLetterUppercase(t('video'))}
            </h2>
            
            { (action === APITools.Methods.POST || action === APITools.Methods.PUT) &&
            <form onSubmit={handleSubmit}>
                {/* <div className="ikMarginT20">
                    <div>
                        <label>
                            {firtsLetterUppercase(t('file'))}
                        </label>
                    </div>
                    <input
                        type="file"
                        accept=".epub"
                        onChange={(e) => {
                            setFile(e.target.files[0]);

                            set_title(e.target.files[0].name.replaceAll("_", " ").replaceAll(".epub", ""));
                        }}
                        className="ikW100"
                    />
                </div> */}

                <div className="ikMarginT20">
                    <div>
                        <label>
                            {firtsLetterUppercase(t('title'))} <Mandatory />
                        </label>
                    </div>
                    <input type="text" required
                        value={title}
                        onChange={(e) => { set_title(e.target.value || ""); }}
                        placeholder={firtsLetterUppercase(t('title'))}
                        className="ikW100"
                    />
                </div>

                <div className="ikMarginT20">
                    <div>
                        <label>
                            {firtsLetterUppercase(t('laguage'))} <Mandatory />
                        </label>
                    </div>
                    <select required
                        value={language}
                        onChange={(e) => { 
                            set_language(e.target.value || "");
                        }}
                        className="ikW100"
                    >
                        <option value={""}>{firtsLetterUppercase(t('choose_one'))}</option>
                        {Object.values(APITools.Languages).map((lang, index) => (
                            <option key={index}
                                value={lang}
                            >
                                {lang.toLocaleUpperCase()}
                            </option>
                        ))}
                    </select>
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
                        {title}
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
export default VideoForm;