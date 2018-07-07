const Base64 = require('js-base64').Base64;
const sha256 = require('sha256');

const AuthUtils = {
    encodePassword: (password) => {
        return AuthUtils._reverseString(
            sha256(Base64.encode(password))
        );
    },
    _reverseString: (s) => {
        return s.split("").reverse().join("");
    }
};

module.exports = AuthUtils;