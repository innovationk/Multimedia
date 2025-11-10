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
import APIDownloadButton from "../../tools/APIDownloadButton";
import PlusIcon from "../../assets/icons/PlusIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import EditIcon from "../../assets/icons/EditIcon";
import Modal from "../../theme/Modal";
import SongForm from "./SongForm";
import SongPlayer from "./SongPlayer";


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
    <div className="albumSongs">
        { ACCOUNT.admin === 1 &&
        <div className="ikTextRight ikMarginB40">
            <button className="button1"
                onClick={(e) => {
                    e.preventDefault();
                    setModalAction(APITools.Methods.POST);
                    setModalObject({
                        [`song.album_id`]: albumId
                    });
                    modalCURef.current.setIsOpen(true);
                }}
            >
                <PlusIcon width={25} height={25}/>
            </button>
        </div>
        }

        <div className="ikTableWrapper">
            <table>
                <tbody>
                    { rows.map((row, iRow) => (
                        <tr key={iRow} >
                            <td>
                                {row[`song.track`]}
                            </td>
                            <td>
                                {row[`song.title`]}
                            </td>
                            <td>
                                <SongPlayer path={`/api/songs/${row[`song.id`]}/stream`}/>
                            </td>
                            <td>
                                <APIDownloadButton downloadUrl={`${APITools.getURL({})}/api/songs/${row[`song.id`]}/download`}
                                    title={`${row[`song.track`]}-${row[`song.title`]}`}
                                    extension="mp3"
                                    classNames="button1"
                                />
                                { ACCOUNT.admin === 1 &&
                                <>
                                    <button className="buttonConfirmDelete"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setModalAction(APITools.Methods.DELETE);
                                            setModalObject(row);
                                            modalCURef.current.setIsOpen(true);
                                        }}
                                    >
                                        <DeleteIcon width={25} height={25}/>
                                    </button>
                                    <button className="buttonEdit"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setModalAction(APITools.Methods.PUT);
                                            setModalObject(row);
                                            modalCURef.current.setIsOpen(true);
                                        }}
                                    >
                                        <EditIcon width={25} height={25}/>
                                    </button>
                                </>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <Modal ref={modalCURef}>
            <SongForm
                initRow={modalObject}
                action={modalAction}
                onSaveDB={() => {
                    fetchRows();
                    modalCURef.current.setIsOpen(false);
                }}
            />
        </Modal>
    </div>
    );
}
export default AlbumSongs;