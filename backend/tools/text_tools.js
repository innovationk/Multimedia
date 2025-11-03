const BASIC_LOWER_CASE_CHARACTERS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const LOWER_CASE_CHARACTERS = BASIC_LOWER_CASE_CHARACTERS.concat(["à", "è", "ì", "ò", "ù", "á", "é", "í", "ó", "ú", "ý", "â", "ê", "î", "ô", "û", "ã", "ñ", "õ", "ä", "ë", "ï", "ö", "ü", "ÿ", "å", "æ", "œ", "ç", "ð", "ø"]);
const BASIC_UPPER_CASE_CHARACTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const UPPER_CASE_CHARACTERS = BASIC_UPPER_CASE_CHARACTERS.concat(["À", "È", "Ì", "Ò", "Ù", "Á", "É", "Í", "Ó", "Ú", "Ý", "Â", "Ê", "Î", "Ô", "Û", "Ã", "Ñ", "Õ", "Ä", "Ë", "Ï", "Ö", "Ü", "Ÿ", "Å", "Æ", "Œ", "Ç", "Ð", "Ø"]);
const NUMBER_CHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const BASIC_CHARACTERS = [].concat(BASIC_LOWER_CASE_CHARACTERS, BASIC_UPPER_CASE_CHARACTERS, NUMBER_CHARACTERS);
const SPECIAL_CHARACTERS = ["+", "-", "_", "&", "|", "!", "(", ")", "{", "}", "[", "]", "^", "~", "*", "?", ":", "@"];
const JURIDICAL_CHARACTERS = ["-", "_", " "].concat(LOWER_CASE_CHARACTERS, UPPER_CASE_CHARACTERS, NUMBER_CHARACTERS);
const ALL_CHARACTERS = [].concat(LOWER_CASE_CHARACTERS, UPPER_CASE_CHARACTERS, NUMBER_CHARACTERS, SPECIAL_CHARACTERS);

const BASIC_CHARACTERS_LENGTH = BASIC_CHARACTERS.length;
const RANDOM_STRING_CANDIDATES = [].concat(BASIC_LOWER_CASE_CHARACTERS, BASIC_UPPER_CASE_CHARACTERS, SPECIAL_CHARACTERS);

const LOREM_IPSUM_SHORT = "Lorem ipsum dolor sit amet.";
const LOREM_IPSUM_LONG = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo pharetra volutpat. Nam fringilla arcu a nisl pulvinar, faucibus gravida ipsum congue. Sed varius, augue non eleifend porta, lorem orci fermentum neque, vel tempor libero nibh eget justo. Vivamus condimentum elit id justo gravida, mattis mattis libero condimentum. Sed finibus bibendum congue. In quis elementum mauris. Praesent eget sodales orci, ultricies imperdiet enim. Integer finibus sagittis magna, eget egestas mi imperdiet non. Vivamus et lacinia lorem. Vestibulum nibh est, molestie et vulputate vitae, mattis ut lacus. Fusce vestibulum mollis dui ac convallis.";

export default class TextTools {
    static getRandomInt({ max }) {
        return Math.floor(Math.random() * max);
    }

    static randomString({ length, candidates = RANDOM_STRING_CANDIDATES }) {
        let string = "";

        const maxI = candidates.length;
        for (let i = 0; i < length - 1; ++i) {
            const iChar = this.getRandomInt({ max: maxI });
            string += candidates[iChar];
        }
        // Never end with @ or problem in database
        string += BASIC_CHARACTERS[this.getRandomInt({ max: BASIC_CHARACTERS_LENGTH })];

        return string;
    }

    static haveAtLeastOne({ string, array }) {
        return array.some(substring => {
            if (string.includes(substring)) {
                return true;
            }

            return false;
        });
    }

    static filterAllowed({ string, array }) {
        let output = "";

        for (var iChar = 0; iChar < string.length; iChar++) {
            const character = string.charAt(iChar);
            if (array.includes(character)) {
                output += character;
            }
        }

        return output;
    }

    static generateSlug(input) {
        let cleaned = input.replace(/[^a-zA-Z0-9\s]/g, '');
        cleaned = cleaned.toLowerCase();
        cleaned = cleaned.replace(/\s+/g, '-');
        cleaned = cleaned.trim();
        return cleaned;
    }

    /*
        trim(): Removes leading and trailing whitespace to ensure no extra spaces affect the count.
        split(/\s+/): Splits the string by one or more whitespace characters.
        filter(Boolean): Removes any empty strings from the result array (in case of irregular spacing).
    */
    static countWords(str) {
        return str.trim().split(/\s+/).filter(Boolean).length;
    }

    static cleanLowercaseString(str) {
        return (str.toLowerCase()).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9]/ig, "");
    }

    static get BASIC_LOWER_CASE_CHARACTERS() { return BASIC_LOWER_CASE_CHARACTERS; }
    static get LOWER_CASE_CHARACTERS() { return LOWER_CASE_CHARACTERS; }
    static get BASIC_UPPER_CASE_CHARACTERS() { return BASIC_UPPER_CASE_CHARACTERS; }
    static get UPPER_CASE_CHARACTERS() { return UPPER_CASE_CHARACTERS; }
    static get BASIC_CHARACTERS() { return BASIC_CHARACTERS; }
    static get NUMBER_CHARACTERS() { return NUMBER_CHARACTERS; }
    static get SPECIAL_CHARACTERS() { return SPECIAL_CHARACTERS; }
    static get JURIDICAL_CHARACTERS() { return JURIDICAL_CHARACTERS; }
    static get ALL_CHARACTERS() { return ALL_CHARACTERS; }
    static get LOREM_IPSUM_SHORT() { return LOREM_IPSUM_SHORT; }
    static get LOREM_IPSUM_LONG() { return LOREM_IPSUM_LONG; }
}