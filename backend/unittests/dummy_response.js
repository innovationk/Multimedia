export default class DummyResponse {
    code = null;
    data = null;

    status(code) {
        this.code = code;
        return this;
    }

    json(payload) {
        this.data = payload;
        return this;
    }
};