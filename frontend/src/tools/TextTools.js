export const BASIC_LOWER_CASE_CHARACTERS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
export const LOWER_CASE_CHARACTERS = BASIC_LOWER_CASE_CHARACTERS.concat(["à", "è", "ì", "ò", "ù", "á", "é", "í", "ó", "ú", "ý", "â", "ê", "î", "ô", "û", "ã", "ñ", "õ", "ä", "ë", "ï", "ö", "ü", "ÿ", "å", "æ", "œ", "ç", "ð", "ø"]);
export const BASIC_UPPER_CASE_CHARACTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
export const UPPER_CASE_CHARACTERS = BASIC_UPPER_CASE_CHARACTERS.concat(["À", "È", "Ì", "Ò", "Ù", "Á", "É", "Í", "Ó", "Ú", "Ý", "Â", "Ê", "Î", "Ô", "Û", "Ã", "Ñ", "Õ", "Ä", "Ë", "Ï", "Ö", "Ü", "Ÿ", "Å", "Æ", "Œ", "Ç", "Ð", "Ø"]);
export const NUMBER_CHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export const BASIC_CHARACTERS = [].concat(BASIC_LOWER_CASE_CHARACTERS, BASIC_UPPER_CASE_CHARACTERS, NUMBER_CHARACTERS);
export const SPECIAL_CHARACTERS = ["+", "-", "_", "&", "|", "!", "(", ")", "{", "}", "[", "]", "^", "~", "*", "?", ":", "@"];
export const JURIDICAL_CHARACTERS = ["-", "_", " "].concat(LOWER_CASE_CHARACTERS, UPPER_CASE_CHARACTERS, NUMBER_CHARACTERS);
export const ALL_CHARACTERS = [].concat(LOWER_CASE_CHARACTERS, UPPER_CASE_CHARACTERS, NUMBER_CHARACTERS, SPECIAL_CHARACTERS);

export const BASIC_CHARACTERS_LENGTH = BASIC_CHARACTERS.length;
export const RANDOM_STRING_CANDIDATES = [].concat(BASIC_LOWER_CASE_CHARACTERS, BASIC_UPPER_CASE_CHARACTERS, SPECIAL_CHARACTERS);

export const LOREM_IPSUM_SHORT = "Lorem ipsum dolor sit amet.";
export const LOREM_IPSUM_LONG = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo pharetra volutpat. Nam fringilla arcu a nisl pulvinar, faucibus gravida ipsum congue. Sed varius, augue non eleifend porta, lorem orci fermentum neque, vel tempor libero nibh eget justo. Vivamus condimentum elit id justo gravida, mattis mattis libero condimentum. Sed finibus bibendum congue. In quis elementum mauris. Praesent eget sodales orci, ultricies imperdiet enim. Integer finibus sagittis magna, eget egestas mi imperdiet non. Vivamus et lacinia lorem. Vestibulum nibh est, molestie et vulputate vitae, mattis ut lacus. Fusce vestibulum mollis dui ac convallis.";

export const LANGUAGES_ORDER = ["fr", "en", "es", "ar"];


export const firtsLetterUppercase = (input = "") => {
    let output = input;

    if (input.length > 0) {
        output = String(input).charAt(0).toUpperCase() + String(input).slice(1);
    };

    return output;
};

export const firtsLettersUppercase = (input) => {
    let output = input;

    let elements = input.split(" ");
    for (let iElement = 0; iElement < input.length; ++iElement) {
        elements[iElement] = String(elements[iElement]).charAt(0).toUpperCase() + String(elements[iElement]).slice(1);
    };
    output = elements.join(" ");

    return output;
};

export const haveAtLeastOne = ({ string, array }) => {
    return array.some(substring => {
        if (string.includes(substring)) {
            return true;
        }

        return false;
    });
};

export const filterAllowed = ({ string, array }) => {
    let output = "";

    for (var iChar = 0; iChar < string.length; iChar++) {
        const character = string.charAt(iChar);
        if (array.includes(character)) {
            output += character;
        }
    }

    return output;
};

export const truncate = (string, excludedMaxLength) => {
    let output = string || "";
    if (string && string.length > 0 && string.length > excludedMaxLength) {
        string.slice(0, excludedMaxLength - 1) + '...';
    }
    return output;
};

export const getLabelI18n = (input, prefix, prioLang) => {
    let output = "";

    if (input[`${prefix}${prioLang}`]?.length > 0) {
        output = input[`${prefix}${prioLang}`];
    } else {
        for (const lang of LANGUAGES_ORDER) {
            if (input[`${prefix}${lang}`]?.length > 0) {
                output = input[`${prefix}${lang}`];
                break;
            }
        }
    }

    return output;
};

export const generateSlug = (input) => {
    let cleaned = input.replace(/[^a-zA-Z0-9\s]/g, '');
    cleaned = cleaned.toLowerCase();
    cleaned = cleaned.replace(/\s+/g, '-');
    cleaned = cleaned.trim();
    return cleaned;
};