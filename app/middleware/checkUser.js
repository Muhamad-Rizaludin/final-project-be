const authorization = require('../library/authorization');
const responseLibrary = require('../library/response');

async function verifToken(req, res, next){
    let auth    = req.headers["authorization"];
    if(auth){
        try {
            let auth    = req.headers["authorization"];
            let token   = auth.slice(7);
            var tokenVerify = authorization.verifyJWT(token);
            var userID = tokenVerify.userID;
            console.log(userID)
            //check ini
            if(userID!=null){
                req.user = userID;
                next();
            }else{
                responseLibrary(res, 404, "Failed", "User not found", [])
            }
        }catch(err){
            responseLibrary(res, 404, "Failed", "Token Failed", [])
        }
    }else{
        responseLibrary(res, 400, "Failed", "Token Required", [])
    }

}

module.exports = {
    verifToken,
}