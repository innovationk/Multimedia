import AccountTools from "../../backend/api/account/account_tools.js";

async function main() {
    const PASSWORD = "Demo!123456";
    const encryptedPassword = AccountTools.encrypt({ text: PASSWORD });

    console.log("Password:", encryptedPassword);
    console.log("Timestamp:", new Date().valueOf());
}
main();