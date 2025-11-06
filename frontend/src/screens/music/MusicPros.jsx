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
import ProfessionalForm from "../professional/ProfessionalForm";


function MusicPros({
    firstChar="a"
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

        EventBus.on(AppEvents.MusicNewArtist, triggerFetch);
        return () => {
            EventBus.remove(AppEvents.MusicNewArtist, triggerFetch);
        };
    }, []);

    const triggerFetch = async (payload) => {
        if(payload.name.toLowerCase().startsWith(firstChar)) {
            fetchRows();
        }
    };

    const fetchRows = async () => {
        let _rows = [];

        const response = await APITools.send({
            method: APITools.Methods.GET,
            path: `/api/professionals`,
            query: {
                and_music_eq: 1,
                and_name_like: `${firstChar}%`,
                and_state_like: APITools.RowsStates.ACTIVE,
                sort: 'name_ASC',
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
        { rows.length > 0 &&
            <div className="musicSection">
                <div className="h1">{firstChar.toUpperCase()}</div>

                {[...Array(rows.length)].map((_, iRow) => (
                    <div className="ikRow ikRowPaddingV4 ikRowPaddingH4" key={`grid_row_${iRow}`}>

                        {[...Array(4)].map((_, iCol) => {
                            const iComponent = iRow * 4 + iCol;

                            let url = "";
                            if(rows[iComponent]) {
                                url = `/music/artists/${rows[iComponent][`professional.id`]}`;
                            }

                            return (
                                <div className="ikCol25 ikAlignVTop" 
                                    key={`grid_row_${iRow}_col_${iCol}`}
                                >
                                    {rows[iComponent] &&
                                    <div className="musicPro">
                                        <div>
                                            <APIImage path={`/api/professionals/${rows[iComponent][`professional.id`]}/image`}
                                                alt={rows[iComponent][`professional.name`]}
                                                timestamp={new Date().valueOf()}
                                            />
                                        </div>
                                        <div className="ikPaddingH10 ikRow ikAlignVMiddle">
                                            <h2 className="ikMarginT10 ikCol">
                                                {rows[iComponent][`professional.name`]}
                                            </h2>
                                        </div>
                                        { ACCOUNT.admin === 1 &&
                                        <div className="ikRow">
                                            <div className="ikCol50">
                                                <button className="ikW100 buttonConfirmDelete"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setModalAction(APITools.Methods.DELETE);
                                                        setModalObject(rows[iComponent]);
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
                                                        setModalObject(rows[iComponent]);
                                                        modalCURef.current.setIsOpen(true);
                                                    }}
                                                >
                                                    <EditIcon width={25} height={25}/>
                                                </button>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                    }
                                </div>
                            );
                        })}

                    </div>
                ))}

                <Modal ref={modalCURef}>
                    <ProfessionalForm
                        initRow={modalObject}
                        action={modalAction}
                        onSaveDB={() => {
                            modalCURef.current.setIsOpen(false);
                        }}
                    />
                </Modal>
            </div>
        }
    </>
    );
}
export default MusicPros;