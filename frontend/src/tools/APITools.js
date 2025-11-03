const Protocols = {
    HTTP: "http",
    PHTTPS: "https",
};

const Methods = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATH: "PATH",
};

const RowsStates = {
    ACTIVE: "active",
    ARCHIVED: "archived",
    DELETED: "deleted"
};

const DEFAULT_PROTOCOL = import.meta.env.VITE_API_PROTOCOL || Protocols.HTTP;
const DEFAULT_HOST = import.meta.env.VITE_API_HOST || "localhost";
const DEFAULT_PORT = import.meta.env.VITE_API_PORT ? parseInt(import.meta.env.VITE_API_PORT) : -1;   

export default class APITools {     

    static getURL({ protocol = DEFAULT_PROTOCOL, host = DEFAULT_HOST, port = DEFAULT_PORT }) {
        return `${protocol}://${host}${port > 0 ? `:${port}` : ''}`;
    }

    static async send({
        protocol = DEFAULT_PROTOCOL, host = DEFAULT_HOST, port = DEFAULT_PORT,
        method = Methods.GET, path = '', query = {}, body = {}
    }) {
        let output = { apiStatus: 400 };

        const uri = `${this.getURL({ protocol: protocol, host: host, port: port })}${path}${this.buildQueryParams(query)}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (Object.keys(body).length > 0) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(uri, options);
            if (response.ok) {
                output = await response.json();
                output.apiStatus = response.status;
            }
            // return response.ok ? await response.json() : Promise.reject(response);
        } catch (error) {
            console.error(`${method} request failed:`, error);
            throw error;
        }

        return output;
    }

    static buildQueryParams(uriQueries = {}) {
        const query = new URLSearchParams(uriQueries).toString();
        return query ? `?${query}` : '';
    }

    static async fetchImage({
        protocol = DEFAULT_PROTOCOL, host = DEFAULT_HOST, port = DEFAULT_PORT,
        path = '', query = {}
    }) {
        let output = { apiStatus: 400, image: "" };

        const uri = `${this.getURL({ protocol: protocol, host: host, port: port })}${path}${this.buildQueryParams(query)}`;

        try {
            const response = await fetch(uri);
            const imageBlob = await response.blob();
            // /.../imageOK Blob { size: 27, type: "application/json; charset=utf-8" }
            // /.../imageKO Blob { size: 618993, type: "image/png" 
            if (imageBlob.type.includes("image")) {
                output.image = URL.createObjectURL(imageBlob);
            }
            // else {
            //     console.error('Image not found', url);
            // }

        } catch (error) {
            console.error(`${Methods.GET} request failed:`, error);
            throw error;
        }


        return output;
    }

    static async fetchDownload({
        protocol = DEFAULT_PROTOCOL, host = DEFAULT_HOST, port = DEFAULT_PORT,
        path = '', query = {},
        downloadTitle = "lorem.txt"
    }) {
        try {
            const uri = `${this.getURL({ protocol: protocol, host: host, port: port })}${path}${this.buildQueryParams(query)}`;

            const response = await fetch(uri);
            if (!response.ok) {
                throw new Error('Failed to download');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = downloadTitle;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(`${Methods.GET} request failed:`, error);
            throw error;
        }
    }

    static get Protocols() { return Protocols; }
    static get Methods() { return Methods; }
    static get RowsStates() { return RowsStates; }
}