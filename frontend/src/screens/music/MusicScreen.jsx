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
import MusicPros from "./MusicPros";
import ProfessionalForm from "../professional/ProfessionalForm";


function MusicScreen() {
    const { t, i18n } = useTranslation();
    const { showMessage } = useFeedbackMessage();
    const navigate = useNavigate();    

    const ACCOUNT = LocalStorageTools.readData({ key: "account" });

    const modalCURef = useRef(null);
    const [modalAction, setModalAction] = useState(APITools.Methods.POST);
    const [modalObject, setModalObject] = useState({});

    useEffect(() => {
    }, []);


    return(
    <>
        <h1 className="ikTextCenter">
            {firtsLetterUppercase(t('music'))}
        </h1>

        { ACCOUNT.admin === 1 &&
        <div className="ikMarginV20 ikTextRight">
            <button className="button1"
                onClick={(e) => {
                    e.preventDefault();
                    setModalAction(APITools.Methods.POST);
                    setModalObject({});
                    modalCURef.current.setIsOpen(true);
                }}
            >
                <b className="ikMarginH8 ikMarginV4">&#x2b;</b>
            </button>
        </div>
        }

        {/* TODO
        <div className="ikMarginT60">
            <div className="h1">0-9</div>
        </div> */}
        
        {[...Array(26)].map((_, iLetter) => {
            const letter = (iLetter+10).toString(36);

            return ( 
                <MusicPros key={`row_${iLetter}`}
                    firstChar={letter} 
                /> 
            )
        })}

        <Modal ref={modalCURef}>
            <ProfessionalForm
                initRow={modalObject}
                action={modalAction}
                onSaveDB={() => {
                    modalCURef.current.setIsOpen(false);
                }}
            />
        </Modal>
    </>
    );
}
export default MusicScreen;