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


function SongForm({
    initRow = {},
    action = APITools.Methods.POST,
    onSaveDB = (() => { }),
}) {
    const { t, i18n } = useTranslation();
    const { showMessage } = useFeedbackMessage();
    const navigate = useNavigate();

    const ACCOUNT = LocalStorageTools.readData({ key: "account" });

    const [title, set_title] = useState("");
    const [track, set_track] = useState(0);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if(initRow[`song.id`]) {
            set_title(initRow[`song.title`]);
            set_track(initRow[`song.track`]);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let path = `/api/songs`;
        if(action === APITools.Methods.PUT || action === APITools.Methods.DELETE) {
            path += `/${initRow['song.id']}`;
        }

        let formData = {
            token_id: ACCOUNT.token_id,
            token: ACCOUNT.token,
        };
        if(action === APITools.Methods.POST || action === APITools.Methods.PUT) {
            formData.album_id = initRow[`song.album_id`];
            formData.title = title;
            formData.track = track;

            if (file) {
                formData.audio = await APITools.fileInputToBase64(file);
            }
        }

        const response = await APITools.send({
            method: action,
            path: path,
            body: formData
        });
        if (response.apiStatus >= 200 && response.apiStatus < 300) {

            EventBus.dispatch(AppEvents.MusicSongs, {});
            onSaveDB();

        } else {
            showMessage(firtsLetterUppercase(t('wrong_inputs')));
        }
    };


    return (
        <>
            <h2>
                {firtsLetterUppercase(t('song'))}
            </h2>
            
            { (action === APITools.Methods.POST || action === APITools.Methods.PUT) &&
            <form onSubmit={handleSubmit}>
                <div className="ikMarginT20">
                    <div>
                        <label>
                            {firtsLetterUppercase(t('file'))} <Mandatory />
                        </label>
                    </div>
                    <input
                        type="file" required
                        accept=".mp3"
                        onChange={(e) => {
                            setFile(e.target.files[0]);

                            const fileName = e.target.files[0].name;
                            const fileNameElements = fileName.split("-");
                            if(fileNameElements.length > 1){
                                set_track(parseInt(fileNameElements.shift()));
                                set_title(fileNameElements.join("-").replaceAll("_", " ").replaceAll(".mp3", ""));
                            } else {
                                set_title(fileName.replaceAll("_", " ").replaceAll(".mp3", ""));
                            }
                        }}
                        className="ikW100"
                    />
                </div>

                <div className="ikMarginT20">
                    <div>
                        <label>
                            {firtsLetterUppercase(t('track'))} <Mandatory />
                        </label>
                    </div>
                    <input type="number" required
                        value={track + ''}
                        onChange={(e) => { set_track(parseFloat(e.target.value, 10) || 0.00); }}
                        placeholder={firtsLetterUppercase(t('track'))}
                        step={1}
                        min={1}
                        className="ikW100"
                    />
                </div>

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
                        {track} - {title}
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
export default SongForm;