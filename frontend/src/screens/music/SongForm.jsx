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
    // const imageInputRef = useRef(null);

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

        let inputs = {
            token_id: ACCOUNT.token_id,
            token: ACCOUNT.token,
        };
        if(action === APITools.Methods.POST || action === APITools.Methods.PUT) {
            if(action === APITools.Methods.POST){
                inputs.album_id = initRow[`song.album_id`];
            }

            inputs.title = title;
            inputs.track = track;

            // if (!imageInputRef.current.isEmpty()) {
            //     inputs.image = imageInputRef.current.getValue();
            // }
        }

        const response = await APITools.send({
            method: action,
            path: path,
            body: inputs
        });
        if (response.apiStatus >= 200 && response.apiStatus < 300) {

            EventBus.dispatch(AppEvents.Musicsong, {});
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
                            {firtsLetterUppercase(t('track'))}
                        </label>
                    </div>
                    <input type="number" required
                        value={track + ''}
                        onChange={(e) => { set_track(parseFloat(e.target.value, 10) || 0.00); }}
                        placeholder={firtsLetterUppercase(t('track'))}
                        step={1}
                        min={0}
                        className="ikW100"
                    />
                </div>

                <div className="ikMarginT20">
                    {/* <ImageInput ref={imageInputRef}
                        placeholder={firtsLetterUppercase(t('image'))}
                    /> */}
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
export default SongForm;