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
import APIDownloadButton from "../../tools/APIDownloadButton";
import PlusIcon from "../../assets/icons/PlusIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import EditIcon from "../../assets/icons/EditIcon";
import Modal from "../../theme/Modal";
import BookForm from "./BookForm";


function BooksScreen() {
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
            path: `/api/books`,
            query: {
                sort: 'book.title_ASC',
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
            {firtsLetterUppercase(t('books'))}
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

        {/* <div className="ikMarginT20">
            {rows.map((row, index) => (
                <div key={`row_${index}`} className="ikRow">
                    <div className="ikCol">
                        {row[`book.title`]} 
                        { row[`book.language`] !== APITools.Languages.NONE &&
                            <> ({row[`book.language`]})</>
                        }
                    </div>
                    <div className="ikCol">
                        <APIDownloadButton downloadUrl={`${APITools.getURL({})}/api/books/${row[`book.id`]}/download`}
                            title={generateSlug(row[`book.title`])}
                            extension="epub"
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
                    </div>
                </div>
            ))}
        </div> */}

        <div className="ikTableWrapper">
            <table>
                <thead>
                    <tr>
                        <th>
                            {firtsLetterUppercase(t(`language`))}
                        </th>
                        <th className="ikPaddingV10">
                            {firtsLetterUppercase(t(`title`))}
                        </th>
                        <th className="ikPaddingV10">
                            {firtsLetterUppercase(t(`description`))}
                        </th>
                        <th>
                            {firtsLetterUppercase(t(`actions`))}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={`row_${index}`}>
                            <td className="ikTextCenter">
                                { row[`book.language`] !== APITools.Languages.NONE &&
                                    <> {(row[`book.language`] || "").toUpperCase()}</>
                                }
                            </td>
                            <td className="ikTextCenter ikPaddingV10">
                                {row[`book.title`]} 
                            </td>
                            <td className="ikTextCenter ikPaddingV10">
                                <span style={{ whiteSpace: "pre-wrap" }}>{row[`book.description`]}</span>
                            </td>
                            <td className="ikTextCenter">
                                <APIDownloadButton downloadUrl={`${APITools.getURL({})}/api/books/${row[`book.id`]}/download`}
                                    title={generateSlug(row[`book.title`])}
                                    extension="epub"
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
            <BookForm 
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
export default BooksScreen;