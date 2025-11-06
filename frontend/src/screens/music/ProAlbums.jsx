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
import AlbumSongs from "./AlbumSongs";


function ProAlbums() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { showMessage } = useFeedbackMessage();

    const ACCOUNT = LocalStorageTools.readData({ key: "account" });

    const { professionalId } = useParams();

    const [mainEntity, setMainEntity] = useState({});

    const modalCURef = useRef(null);
    const [modalAction, setModalAction] = useState(APITools.Methods.POST);
    const [modalObject, setModalObject] = useState({});
    
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchMainEntity();
        fetchRows();

        EventBus.on(AppEvents.MusicAlbum, fetchRows);
        return () => {
            EventBus.remove(AppEvents.MusicAlbum, fetchRows);
        };
    }, []);

    const fetchMainEntity = async () => {
        let _row = {};

        const response = await APITools.send({
            method: APITools.Methods.GET,
            path: `/api/professionals/${professionalId}`
        });
        if (response.apiStatus === 200) {
            _row = response.row;
        }

        setMainEntity(_row);
    };

    const fetchRows = async () => {
        let _rows = [];

        const response = await APITools.send({
            method: APITools.Methods.GET,
            path: `/api/albums`,
            query: {
                and_professional_id_eq: professionalId,
                and_state_like: APITools.RowsStates.ACTIVE,
                sort: 'year_ASC,title_ASC',
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
        <div className="backDiv">
            <NavLink to={`/music`}>
                <ArrowLeftIcon width={25} height={25} />
            </NavLink>
        </div>

        <div className="ikRow ikRowPaddingH4">
            <div className="ikCol33">
                <APIImage path={`/api/professionals/${professionalId}/image`}
                    alt={`${mainEntity[`professional.name`]} ${mainEntity[`professional.surname`]}`}
                    timestamp={new Date().valueOf()}
                    cssClasses={`ikW100 ikH100 ikRound8`}
                />
            </div>
            <div className="ikCol66">
                <h1 className="ikTextCenter">
                    {mainEntity[`professional.name`]} {mainEntity[`professional.surname`]}
                </h1>
            </div>
        </div>

        <div className="line1"></div>

        { ACCOUNT.admin === 1 &&
        <div className="ikTextRight ikMarginB40">
            <button className="button1"
                onClick={(e) => {
                    e.preventDefault();
                    setModalAction(APITools.Methods.POST);
                    setModalObject({
                        [`album.professional_id`]: professionalId
                    });
                    modalCURef.current.setIsOpen(true);
                }}
            >
                <PlusIcon width={25} height={25}/>
            </button>
        </div>
        }

        <div>
            {rows.map((row, iRow) => (
            <div key={iRow} 
                className="album ikMarginB20"
            >
                <div className="ikRow ikRowPaddingH4">
                    <div className="ikCol33">
                        <APIImage path={`/api/albums/${row[`album.id`]}/image`}
                            alt={`${row[`album.title`]}`}
                            timestamp={new Date().valueOf()}
                            cssClasses={`ikW100 ikH100 ikRound8`}
                        />
                    </div>
                    <div className="ikCol66 ikAlignVTop">
                        { ACCOUNT.admin === 1 &&
                        <div className="ikRow ikRowPaddingH4 ikMarginB20">
                            <div className="ikCol50">
                                <button className="ikW100 buttonConfirmDelete"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setModalAction(APITools.Methods.DELETE);
                                        setModalObject(row);
                                        modalCURef.current.setIsOpen(true);
                                    }}
                                >
                                    <DeleteIcon width={25} height={25}/>
                                </button>
                            </div>
                            <div className="ikCol50">
                                <button className="ikW100 buttonEdit"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setModalAction(APITools.Methods.PUT);
                                        setModalObject(row);
                                        modalCURef.current.setIsOpen(true);
                                    }}
                                >
                                    <EditIcon width={25} height={25}/>
                                </button>
                            </div>
                        </div>
                        }
                        <h2>
                            {row[`album.title`]}
                        </h2>
                        <div className="albumSubtitle">
                            {row[`album.year`]}
                        </div>
                        <div>
                            <AlbumSongs albumId={row[`album.id`]}/>
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>

        <Modal ref={modalCURef}>
            <AlbumForm
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
export default ProAlbums;