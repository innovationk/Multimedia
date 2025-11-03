import Crypto from 'node:crypto';

export default class CryptoTools {
    
    static sha256({ text, exportFormat = 'hex' }) {
        let output = Crypto.createHash('sha256').update(text).digest(exportFormat);
        if( exportFormat === "hex" ) {
            output = `0x${output}`
        }
        return output
    }

    static sha512({ text, exportFormat = 'hex' }) {
        let output = Crypto.createHash('sha512').update(text).digest(exportFormat);
        if( exportFormat === "hex" ) {
            output = `0x${output}`
        }
        return output
    }

    static randomString({ length, exportFormat = 'hex' }) {
        let output = Crypto.randomBytes(length).toString(exportFormat);
        if( exportFormat === "hex" ) {
            output = `0x${output}`
        }
        return output;
    }

    static isOdd = number => {
        return number % 2;
    }

    static isEven = number => {
        return !isOdd(number);
    }

    static hexadecimalToArrayBase10({ hexString = "", step = 2 }) {
        let outputArray = []
        
        for (let i = 0; i < hexString.length; i += step) {
            outputArray.push( parseInt(hexString.substr(i, 2), 16) );
        }

        return outputArray
    }

    static hexadecimalToBase64({ hexString = "" }) {
        return Buffer.from(hexString, 'hex').toString('base64');
    }

    static base64ToHexadecimal({ base64String }) {
        return Buffer.from(base64String, 'base64').toString('hex')
    }

    static binaryToBase64({ binaryString }) {
        return Buffer.from(binaryString, 'binary').toString('base64');
    }

    static binaryToHexadecimal({ binaryString }) {
        return Buffer.from(binaryString, 'binary').toString('hex');
    }

    static base64ToUtf8({ base64String }) {
        return Buffer.from(base64String, 'base64').toString('utf8');
    }

    static utf8ToBase64({ utf8String }) {
        return Buffer.from(utf8String, 'utf8').toString('base64');
    }

    static generatePair({ passphrase = "" }) {
        return Crypto.generateKeyPairSync('rsa', {
            modulusLength: 512,
            namedCurve: 'secp256k1', 
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'     
            },     
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: passphrase
            } 
        });
    }

    static encrypt({ text, publicKey }) {
        const buffer = Buffer.from(text);
        const encrypted = Crypto.publicEncrypt(publicKey, buffer);
        return encrypted.toString("base64");
    }

    static decrypt({ text, privateKey, passphrase = "" }) {
        const buffer = Buffer.from(text, "base64");
        const decrypted = Crypto.privateDecrypt(
            {
                key: privateKey,
                passphrase: passphrase,
            },
            buffer,
        )
        return decrypted.toString("utf8");
    }
}