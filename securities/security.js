
const bcrypt = require('bcrypt');

// const Security = {

async function EncryptString(PlainTextPWD) {

    const saltRounds = 12; // Recommended balance of security and speed

    // Generates a random salt and hashes the password altogether
    const hashedPassword = await bcrypt.hash(PlainTextPWD, saltRounds);

    // Save this 'hashedPassword' to your database
    return hashedPassword;

}




 async function Compare(incomingPassword, storedHash) {
    const isMatch = await bcrypt.compare(incomingPassword, storedHash);

    if (isMatch) {
        return true;
    } else {
        // console.log("Invalid credentials.");
        return false;
    }

};
module.exports={
    EncryptString,
    Compare
}