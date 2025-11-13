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
import VideoForm from "./VideoForm";
import Modal from "../../theme/Modal";
import PlusIcon from "../../assets/icons/PlusIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import EditIcon from "../../assets/icons/EditIcon";


function VideosScreen() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { showMessage } = useFeedbackMessage();

    const ACCOUNT = LocalStorageTools.readData({ key: "account" });

    const [rows, setRows] = useState([]);

    const modalCURef = useRef(null);
    const [modalAction, setModalAction] = useState(APITools.Methods.POST);
    const [modalObject, setModalObject] = useState({});

    useEffect(() => {
        fetchRows();
    }, []);

    const fetchRows = async () => {
        let _rows = [];

        const response = await APITools.send({
            method: APITools.Methods.GET,
            path: `/api/videos`,
            query: {
                sort: 'video.title_ASC',
                elements_per_page: 20
            }
        });
        if (response.apiStatus === 200) {
            _rows = response.rows;
        }

        setRows(_rows);
    };


    return(
    <>
        <h1 className="ikTextCenter">
            {firtsLetterUppercase(t('videos'))}
        </h1>

        { ACCOUNT.admin === 1 &&
        <div className="ikTextRight ikMarginB40">
            <button className="button1"
                onClick={(e) => {
                    e.preventDefault();
                    setModalAction(APITools.Methods.POST);
                    setModalObject({});
                    modalCURef.current.setIsOpen(true);
                }}
            >
                <PlusIcon width={25} height={25}/>
            </button>
        </div>
        }

        <div className="ikMarginT20">
            {/* {rows.map((row, index) => (
                <div key={`row_${index}`} className="ikRow">
                    <div className="ikCol">
                        <NavLink to={`/videos/${row[`video.id`]}`}>
                            {row[`video.title`]} 
                            { row[`video.language`] !== APITools.Languages.NONE &&
                                <>({row[`video.language`]})</>
                            }
                        </NavLink>
                    </div>
                    {/* <div className="ikCol">
                        <APIDownloadButton downloadUrl={`${APITools.getURL({})}/api/videos/${row[`video.id`]}/download`}
                            title={generateSlug(row[`video.title`])}
                            extension="mp4"
                            classNames="button1"
                        />
                    </div> /}
                </div>
            ))} */}

            <div className="ikTableWrapper">
                <table>
                    <thead>
                        <tr>
                            <th className="ikPaddingV10">
                                {firtsLetterUppercase(t(`title`))}
                            </th>
                            <th>
                                {firtsLetterUppercase(t(`language`))}
                            </th>
                            { ACCOUNT.admin === 1 &&
                            <th>
                                {firtsLetterUppercase(t(`actions`))}
                            </th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={`row_${index}`}>
                                <td className="ikTextCenter ikPaddingV10">
                                    <NavLink to={`/videos/${row[`video.id`]}`}>
                                        {row[`video.title`]} 
                                    </NavLink>
                                </td>
                                <td className="ikTextCenter">
                                    { row[`video.language`] !== APITools.Languages.NONE &&
                                        <>{row[`video.language`].toUpperCase()}</>
                                    }
                                </td>
                                { ACCOUNT.admin === 1 &&
                                <td className="ikTextCenter">
                                    {/* <button className="buttonConfirmDelete"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setModalAction(APITools.Methods.DELETE);
                                            setModalObject(row);
                                            modalCURef.current.setIsOpen(true);
                                        }}
                                    >
                                        <DeleteIcon width={25} height={25}/>
                                    </button> */}
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
                                </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <Modal ref={modalCURef}>
            <VideoForm
                initRow={modalObject}
                action={modalAction}
                onSaveDB={() => {
                    fetchRows();
                    modalCURef.current.setIsOpen(false);
                }}
            />
        </Modal>
    </>
    );
}
export default VideosScreen;