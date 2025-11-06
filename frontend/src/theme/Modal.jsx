import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import CloseTopRightButton from "./CloseTopRightButton";

const Modal = forwardRef(function Modal({
    children,
    zIndex = 98,
    paddingVertical = "5vh",
    width = "80%"
}, ref) {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        setIsOpen
    }));

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => document.body.style.overflow = 'unset';
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal" style={{ zIndex: zIndex, paddingTop: paddingVertical, paddingBottom: paddingVertical }}>
            <div className="modalContent" style={{ width: width }}>
                <div className="modalHeader">
                    <CloseTopRightButton classNames="ikButtonClear"
                        onClickCallback={() => { setIsOpen(false); }}
                    />
                </div>
                <div className="modalBody">
                    {children}
                </div>
            </div>
        </div>
    );
});
export default Modal;