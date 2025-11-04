import { forwardRef, useState, useEffect, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import EyeOpenIcon from '../../assets/icons/EyeOpenIcon';
import EyeCloseIcon from '../../assets/icons/EyeCloseIcon';
import { firtsLetterUppercase, haveAtLeastOne, filterAllowed, LOWER_CASE_CHARACTERS, UPPER_CASE_CHARACTERS, NUMBER_CHARACTERS, SPECIAL_CHARACTERS, ALL_CHARACTERS } from '../../tools/TextTools';

const InputPassword = forwardRef(function InputPassword({
    initValue = "",
    showRules = false
}, ref) {
    const { t } = useTranslation();
    const [value, setValue] = useState("");
    const [inuptType, setInputType] = useState("password");
    const [rules, setRules] = useState([
        { value: false, legend: t("one_number") },
        { value: false, legend: t("one_special_char") },
        { value: false, legend: t("one_lowercase_char") },
        { value: false, legend: t("one_uppercase_char") },
        { value: false, legend: `8 ${t("min_chars")}` },
    ]);

    useEffect(() => {
        setValue(initValue);
    }, [initValue]);

    useImperativeHandle(ref, () => ({
        getValue, setValue, isOk
    }));

    const getValue = () => {
        return value;
    };

    const isOk = () => {
        let output = true;

        for (const rule of rules) {
            output &= rule.value;
        }

        return output;
    };

    const checkRules = async (newValue) => {
        setRules([
            { legend: t("one_lowercase_char"), value: haveAtLeastOne({ string: newValue, array: LOWER_CASE_CHARACTERS }) },
            { legend: t("one_uppercase_char"), value: haveAtLeastOne({ string: newValue, array: UPPER_CASE_CHARACTERS }) },
            { legend: t("one_number"), value: haveAtLeastOne({ string: newValue, array: NUMBER_CHARACTERS }) },
            { legend: t("one_special_char"), value: haveAtLeastOne({ string: newValue, array: SPECIAL_CHARACTERS }) },
            { legend: `8 ${t("min_chars")}`, value: newValue.length >= 8 },
            { legend: `${t("only_chars_allowed")}`, value: newValue === filterAllowed({ string: newValue, array: ALL_CHARACTERS }) },
        ]);
    };


    return (
        <>
            <div className='ikRow'>
                <div className='ikCol ikPaddingR8'>
                    <input type={inuptType} required
                        className={`ikW100`}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            checkRules(e.target.value);
                        }}
                        name='password'
                        placeholder={firtsLetterUppercase(t('password'))}
                    />
                </div>
                <div className='ikCol ikPaddingL8'>
                    <button className='ikW100 button2'
                        style={{ paddingTop: "5px", paddingBottom: "5px" }}
                        onClick={(e) => {
                            e.preventDefault();
                            setInputType(inuptType === "password" ? "text" : "password");
                        }}
                    >
                        {inuptType === "password" ?
                            <EyeOpenIcon />
                            :
                            <EyeCloseIcon />
                        }
                    </button>
                </div>
            </div>
        </>
    );
});
InputPassword.propTypes = {
    initValue: PropTypes.string,
};
export default InputPassword;