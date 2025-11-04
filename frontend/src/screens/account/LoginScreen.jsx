import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { firtsLetterUppercase } from "../../tools/TextTools";
import { useFeedbackMessage } from "../../theme/FeedbackMessageContext";
import APITools from "../../tools/APITools";
import EventBus from '../../tools/EventBus';
import AppEvents from '../../theme/AppEvents';
import LocalStorageTools from "../../tools/LocalStorageTools";
import CssTools from "../../tools/CssTools";
import Mandatory from '../../components/Mandatory'
import InputPassword from "./InputPassword";


function LoginScreen() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { showMessage } = useFeedbackMessage();

    const [pseudo, set_pseudo] = useState("");
    const passwordRef = useRef(null);

    useEffect(() => {
        LocalStorageTools.removeData({ key: 'account' });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await APITools.send({
            method: APITools.Methods.PUT,
            path: "/api/login",
            body: {
                pseudo: pseudo,
                password: passwordRef.current.getValue(),
            }
        });
        if (response.hasOwnProperty("token")) {
            
            LocalStorageTools.upsertData({ key: 'account', jsonData: response });
            EventBus.dispatch(AppEvents.Login, { message: null });

            navigate(`/home`);

        } else {
            showMessage(firtsLetterUppercase(t('wrong_inputs')));
        }
    }


    return(
    <div className="ikRelativeChildCenterVH" style={{ width: "50%", maxWidth: CssTools.getCSSVariable("--body-maxwidth") }}>
        <h1 className="ikTextCenter">
            {firtsLetterUppercase(t('log_in'))}
        </h1>
        
        <form onSubmit={handleSubmit}>

            <div className='ikRow'>
                <div className='ikCol100 ikTextLeft'>
                    <label>
                        {firtsLetterUppercase(t('pseudo'))}
                        <Mandatory />
                    </label>
                    <div className='ikMarginT8'>
                        <input type='pseudo' required
                            name='pseudo'
                            value={pseudo}
                            onChange={(e) => { set_pseudo(e.target.value); }}
                            placeholder={firtsLetterUppercase(t('pseudo'))}
                            className={`ikW100`}
                        />
                    </div>
                </div>
            </div>
            <div className='ikRow ikMarginT16'>
                <div className='ikCol100 ikTextLeft'>
                    <label>
                        {firtsLetterUppercase(t('password'))}
                        <Mandatory />
                    </label>
                    <div className='ikMarginT8'>
                        <InputPassword ref={passwordRef} showRules={false} />
                    </div>
                </div>
            </div>

            <div className='ikMarginT32 ikTextCenter'>
                <button type='submit' className='button1'>
                    {firtsLetterUppercase(t('login'))}
                </button>
            </div>

        </form>
    </div>
    );
}
export default LoginScreen;