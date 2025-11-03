export default class LocalStorageTools {
    static upsertData({ key, jsonData }) {
        localStorage.setItem(key, JSON.stringify(jsonData));
    }

    static readData({ key }) {
        return JSON.parse(localStorage.getItem(key) || "{}");
    }

    static removeData({ key }) {
        localStorage.removeItem(key);
    }

    static async isAccountValid() {
        let output = false;

        const account = this.readData({ key: 'account' });
        if (account && account.token_deadline && account.token_id) {
            // Check deadline
            const now = (new Date()).valueOf();
            const difference = account.token_deadline - now;
            if (difference > 0) {

                if (process.env.NODE_ENV === "preprod") {
                    // Check hash
                    const message = `${account.token_id}_${account.token}_${account.token_deadline}`;
                    const msgUint8 = new TextEncoder().encode(message);
                    const hashBuffer = await window.crypto.subtle.digest("SHA-512", msgUint8);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const candidateHash = "0x" + hashArray
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                    output = account.hash === candidateHash;
                } else {
                    output = true;
                }
            }

            if (!output) {
                this.removeData({ key: 'account' });
            }
        }

        return output;
    }
}