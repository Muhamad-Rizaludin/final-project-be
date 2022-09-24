const userRepository = require("../../repository/UserRepository");
const authorization = require("../../library/authorization");
const responseLibrary = require("../../library/response");

async function login(req, res) {
  const userLogin = await userRepository.checkEmail(req.body.email);

  try {
    if (userLogin.count >= 1) {
      const checkPassword = await userRepository.checkPassword(
        req.body.password,
        userLogin.items[0].password
      );
      if (checkPassword == true) {
        console.log(
          "cek generate jwt",
          authorization.generateJWT(req.body.email)
        );
        const dataToken = authorization.generateJWT(userLogin.items[0].key);
        responseLibrary(
          res,
          200,
          {
            id: userLogin.items[0].key,
            name: userLogin.items[0].name,
            email: userLogin.items[0].email,
            alamat: userLogin.items[0].alamat,
            img: `/img/${userLogin.items[0].img}`,
            kota: userLogin.items[0].kota,
            no_hp: userLogin.items[0].no_hp,
            token: dataToken,
          },
          "Login Success"
        );
      } else {
        responseLibrary(res, 400, null, "Login Failed");
      }
    } else {
      responseLibrary(res, 400, null, "Login Failed");
    }
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = login;
