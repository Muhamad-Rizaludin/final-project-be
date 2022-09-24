const userRepository = require('../../repository/UserRepository')
const responseLibrary = require('../../library/response')

async function register(req, res){  
    const checkRegisteredUser = await userRepository.checkEmail(req.body.email)
    if(checkRegisteredUser.count>=1){
        responseLibrary(res, 409, checkRegisteredUser.items[0] , "Register Failed, Email already registered" )
    }else{
        const checkRegisteredUsername = await userRepository.checkName(req.body.name)
        if(checkRegisteredUsername.count>=1){
            responseLibrary(res, 409, checkRegisteredUsername.items[0], "Register Failed, Username already taken" )
        }else{
            const registerUser = await userRepository.registerUser({
                email:req.body.email,
                name:req.body.name,
                password:req.body.password
            })
            responseLibrary(res, 200, registerUser, "Register Success, New user is created")
        }
    }
}

module.exports=register;