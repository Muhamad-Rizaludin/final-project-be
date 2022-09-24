const jwt   = require('jsonwebtoken');

// 1. untuk megenerate token user
function generateJWT(userID) {
    const today = new Date();
    const exp   = new Date(today);
    exp.setDate(today.getDate() + 600);
    console.log("time", Math.floor(exp.getTime() / 1000));
    // console.log(`INI EMAIL ${email}`)
    return jwt.sign({
      userID : userID,
      exp: Math.floor(exp.getTime() / 1000)
    }, 'binar');

}

// 2. untuk authorisasi user
function verifyJWT(token) {
    return jwt.verify(token, process.env.JWT_SECRET || "binar", (err, data) => {
      if(err){
        return err;
      }else{
        return data;
      }
    });
}

module.exports = {
    generateJWT,
    verifyJWT
}