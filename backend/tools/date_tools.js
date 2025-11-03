/*
    const dayOfTheWeek = ( new Date() ).getDay() // 0 represents Sunday, 6 Saturday
*/

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export default class DateTools {
    static get SECOND_IN_MS() { return SECOND_IN_MS; };
    static get MINUTE_IN_MS() { return MINUTE_IN_MS; };
    static get HOUR_IN_MS() { return HOUR_IN_MS; };
    static get DAY_IN_MS() { return DAY_IN_MS; };

    static getFirstDay({ dateRef = new Date() }) {
        const year = dateRef.getFullYear();
        const month = dateRef.getMonth();
        return new Date(year, month, 1);
    }
    static getLastDay({ dateRef = new Date() }) {
        const year = dateRef.getFullYear();
        const month = dateRef.getMonth();
        return new Date(year, month + 1, 0);
    }

    static getModifiedDate({ dateRef = new Date(), element = "days", amount = -1 }) {
        let output = new Date(dateRef);

        if (element === "days") {
            output.setDate(dateRef.getDate() + amount);
        } else if (element === "months") {
            output.setMonth(dateRef.getMonth() + amount);
        } else if (element === "years") {
            output.setFullYear(dateRef.getFullYear() + amount);
        } else if (element === "hours") {
            output.setHours(dateRef.getHours() + amount);
        }

        return output;
    }

    static getDifference({ dateOldest = new Date(), dateYoungest = new Date(), element = "days" }) {
        let output = 0;

        const millisecondsDiff = dateOldest.getTime() - dateYoungest.getTime();
        if (element === "days") {
            output = millisecondsDiff / (1000 * 60 * 60 * 24);
        } /*else if( element === "months" ) {
            
        } else if( element === "years" ) {
            
        }*/

        return output;
    }
}