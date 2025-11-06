import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { firtsLetterUppercase, generateSlug } from "../../tools/TextTools";
import { useFeedbackMessage } from "../../theme/FeedbackMessageContext";
import APITools from "../../tools/APITools";
import EventBus from '../../tools/EventBus';
import AppEvents from '../../theme/AppEvents';
import LocalStorageTools from "../../tools/LocalStorageTools";
import CssTools from "../../tools/CssTools";
import APIImage from "../../tools/APIImage";
import ArrowLeftIcon from "../../assets/icons/ArrowLeftIcon";
import PlusIcon from "../../assets/icons/PlusIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import EditIcon from "../../assets/icons/EditIcon";
import Modal from "../../theme/Modal";
import AlbumForm from "./AlbumForm";


function AlbumSongs({
    albumId=-1
}) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { showMessage } = useFeedbackMessage();

    const ACCOUNT = LocalStorageTools.readData({ key: "account" });

    const modalCURef = useRef(null);
    const [modalAction, setModalAction] = useState(APITools.Methods.POST);
    const [modalObject, setModalObject] = useState({});
    
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchRows();

        EventBus.on(AppEvents.MusicSongs, fetchRows);
        return () => {
            EventBus.remove(AppEvents.MusicSongs, fetchRows);
        };
    }, []);

    const fetchRows = async () => {
        let _rows = [];

        const response = await APITools.send({
            method: APITools.Methods.GET,
            path: `/api/songs`,
            query: {
                and_album_id_eq: albumId,
                and_state_like: APITools.RowsStates.ACTIVE,
                sort: 'track_ASC,title_ASC',
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
        {rows.map((row, iRow) => (
            <div key={iRow} 
                className="song"
            >
                {row[`song.track`]} {row[`song.title`]}
            </div>
        ))}
        

        <Modal ref={modalCURef}>
            {/* <AlbumForm
                initRow={modalObject}
                action={modalAction}
                onSaveDB={() => {
                    fetchRows();
                    modalCURef.current.setIsOpen(false);
                }}
            /> */}
        </Modal>
    </>
    );
}
export default AlbumSongs;