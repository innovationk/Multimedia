import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { firtsLetterUppercase } from "../../tools/TextTools";
import APITools from "../../tools/APITools";
import InputPassword from "./InputPassword";
import EventBus from '../../tools/EventBus';
import AppEvents from '../../theme/AppEvents';
import LocalStorageTools from "../../tools/LocalStorageTools";

function LogoutScreen() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {

        LocalStorageTools.removeData({ key: 'account' });
        EventBus.dispatch(AppEvents.Logout, { message: null });

        navigate(`/login`);

    }, [navigate]);

    return;
}

export default LogoutScreen;
