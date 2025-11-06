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
import DeleteIcon from "../../assets/icons/DeleteIcon";
import EditIcon from "../../assets/icons/EditIcon";
import Modal from "../../theme/Modal";


function ProAlbums() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { showMessage } = useFeedbackMessage();

    const ACCOUNT = LocalStorageTools.readData({ key: "account" });

    // const modalCURef = useRef(null);
    // const [modalAction, setModalAction] = useState(APITools.Methods.POST);
    // const [modalObject, setModalObject] = useState({});
    
    // const [rows, setRows] = useState([]);

    // useEffect(() => {
    //     fetchRows();

    //     EventBus.on(AppEvents.MusicNewArtist, triggerFetch);
    //     return () => {
    //         EventBus.remove(AppEvents.MusicNewArtist, triggerFetch);
    //     };
    // }, []);

    // const triggerFetch = async (payload) => {
    //     if(payload.name.toLowerCase().startsWith(firstChar)) {
    //         fetchRows();
    //     }
    // };

    // const fetchRows = async () => {
    //     let _rows = [];

    //     const response = await APITools.send({
    //         method: APITools.Methods.GET,
    //         path: `/api/professionals`,
    //         query: {
    //             and_music_eq: 1,
    //             and_name_like: `${firstChar}%`,
    //             and_state_like: APITools.RowsStates.ACTIVE,
    //             sort: 'name_ASC',
    //             elements_per_page: Number.MAX_SAFE_INTEGER
    //         }
    //     });
    //     if (response.apiStatus === 200) {
    //         _rows = response.rows;
    //     }

    //     setRows(_rows);
    // };


    return(
    <>
    </>
    );
}
export default ProAlbums;