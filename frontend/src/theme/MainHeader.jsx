import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { firtsLetterUppercase } from "../tools/TextTools";
import EventBus from '../tools/EventBus';
import AppEvents from './AppEvents';
import LocalStorageTools from "../tools/LocalStorageTools";
import CssTools from "../tools/CssTools";
import Logo from "../assets/images/logo_white.png";
// import LogoutIcon from "../assets/images/LogoutIcon";


function MainHeader() {
    const { t, i18n } = useTranslation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [links, setLinks] = useState([]);

    useEffect(() => {
        updateAuthState();

        EventBus.on(AppEvents.Login, updateAuthState);
        EventBus.on(AppEvents.Logout, updateAuthState);
        return () => {
            EventBus.remove(AppEvents.Login, updateAuthState);
            EventBus.remove(AppEvents.Logout, updateAuthState);
        };
    }, []);

    const updateAuthState = async () => {
        if (await LocalStorageTools.isAccountValid()) {
            setIsLoggedIn(true);

            let _links = [
                { label: "home", url: "/home" },
                { label: "music", url: "/music" },
                { label: "movies", url: "/movies" },
                { label: "logout", url: "/logout" }
            ];

            // const ACCOUNT = LocalStorageTools.readData({ key: "account" });
            // if(ACCOUNT.admin === 1) { _links.push({ label: "admin", url: "/admin" }); }

            // _links.push({ label: "settings", url: "/settings" })

            setLinks(_links)
        } else {
            setIsLoggedIn(false);
            setLinks([]);
        }
    };

    return (
        <div className="ikW100">
            {isLoggedIn ?
                <div className="ikRow">
                    {links.map((link, index) => (
                        <div key={`col_${index}`}
                            className="ikCol ikTextCenter"
                            style={{ width: `${ 100 / Math.max(1, links.length) }%` }}
                        >
                            <NavLink to={link.url}>
                                {firtsLetterUppercase(t(link.label))}
                            </NavLink>
                        </div>
                    ))}

                    {/* <div className="ikCol ikCol50 ikTextCenter">
                        <NavLink to={"/home"}>
                            {firtsLetterUppercase(t(`home`))}
                            <img src={Logo} width={50} height={50} />
                        </NavLink>
                    </div>
                    {links.map((link, index) => (
                        <div className="ikCol ikTextCenter" key={`col_${index}`}>
                            <NavLink to={link.url}>
                                {firtsLetterUppercase(t(link.label))}
                            </NavLink>
                        </div>
                    ))}
                    <div className="ikCol ikCol50 ikTextCenter">
                        <NavLink to={"/logout"}>
                            {firtsLetterUppercase(t(`logout`))}
                            <LogoutIcon width={30} height={30} fill={`white`}/>
                        </NavLink>
                    </div> */}
                </div>
                :
                <div className="ikTextCenter ikPaddingT15">
                    <img src={Logo} width={40} height={40} />
                </div>
            }
        </div>
    );
}
export default MainHeader;