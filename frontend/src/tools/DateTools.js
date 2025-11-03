export default class DateTools {
    // const timestamp = Date.now();

    static timestampToDateString({
        timestamp,
        showYear = true, showHoursAndMinutes = false, showSeconds = false
    }) {
        let output = "";

        const date = new Date(timestamp);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = (date.getDate()).toString().padStart(2, "0");
        output = `${day}/${month}`;

        if (showYear) {
            const year = date.getFullYear();
            output += `/${year}`;
        }
        if (showHoursAndMinutes) {
            const hours = (date.getHours()).toString().padStart(2, "0");
            const min = (date.getMinutes()).toString().padStart(2, "0");
            output += ` ${hours}:${min}`;
        }
        if (showSeconds) {
            const secondes = (date.getSeconds()).toString().padStart(2, "0");
            output += `:${secondes}`;
        }

        return output;
    }

    static timestampToDateInput = ({ timestamp }) => {
        const date = new Date(timestamp);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = (date.getDate()).toString().padStart(2, "0");
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    };

    static timestampToDatetimeInput = ({ timestamp }) => {
        const date = new Date(timestamp);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = (date.getDate()).toString().padStart(2, "0");
        const year = date.getFullYear();
        const hours = (date.getHours()).toString().padStart(2, "0");
        const min = (date.getMinutes()).toString().padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${min}`;
    };

    static timestampToExportString({
        timestamp,
        showHoursAndMinutes = false, showSeconds = false
    }) {
        let output = "";

        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = (date.getDate()).toString().padStart(2, "0");
        output = `${year}${month}${day}`;

        if (showHoursAndMinutes) {
            const hours = (date.getHours()).toString().padStart(2, "0");
            const min = (date.getMinutes()).toString().padStart(2, "0");
            output += `${hours}${min}`;
        }
        if (showSeconds) {
            const secondes = (date.getSeconds()).toString().padStart(2, "0");
            output += `${secondes}`;
        }

        return output;
    }
}