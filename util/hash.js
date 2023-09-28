const crypto = require('crypto');

module.exports = {
    hashPassword: (password) => {
        return crypto.createHash('sha256').update(password).digest('hex');
    }
}