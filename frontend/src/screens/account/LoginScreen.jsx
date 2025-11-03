import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { firtsLetterUppercase } from "../../tools/TextTools";
import { useFeedbackMessage } from "../../theme/FeedbackMessageContext";
import APITools from "../../tools/APITools";
import EventBus from '../../tools/EventBus';
import AppEvents from '../../theme/AppEvents';
import LocalStorageTools from "../../tools/LocalStorageTools";
import Mandatory from '../../components/Mandatory'


function LoginScreen() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { showMessage } = useFeedbackMessage();

    const [pseudo, set_pseudo] = useState("");
    

    useEffect(() => {
        LocalStorageTools.removeData({ key: 'account' });
    }, []);

    return(
    <div className="">
        <h1 className="ikTextCenter">
            {firtsLetterUppercase(t('log_in'))}
        </h1>
        
        <form>

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

        </form>
    </div>
    );
}
export default LoginScreen;