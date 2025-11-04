import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { firtsLetterUppercase } from "../tools/TextTools";
import CssTools from "../tools/CssTools";


function MainFooter() {
    const { t, i18n } = useTranslation();

    return (
        <div className="ikW100">
            <div className="ikTextCenter">
                {new Date().getFullYear()} © Innovation K
            </div>
        </div>
    );
}
export default MainFooter;