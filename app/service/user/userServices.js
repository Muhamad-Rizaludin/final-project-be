const userRepository = require('../../repository/UserRepository')
const responseLibrary = require('../../library/response')
const authorization = require('../../library/authorization')
const randomstring	= require("randomstring");
const path 			= require('path');

async function updateUser(req, res){
    // 1. Ambil UserID yang dari token
    var userID = req.user
    if(req.files){
        // mengubah nama file
        var ext = path.extname(req.files.img.name);
        var getext = ext.split(".");
        var filename = randomstring.generate(6);
        // end mengubah nama file
        var imageName = filename+'.'+getext[1];
        // console.log(imageName);
        var imageData = req.files.img.data;

        // 2. Panggil data untuk yang id-nya sama terus ambil password sama emailnya
        const getOldValue = await userRepository.getOldValue(userID)

        // 3. Hapus image yang lama untuk diganti dengan yang baru
        // res.send(getOldValue.items[0].img)
        if(getOldValue.items[0].img){
            await userRepository.deleteImg(getOldValue.items[0].img)
        }

        // 4. upload img baru ke drive Deta
        await userRepository.uploadImg(imageName, imageData)

        // 5. Panggil usersepository untuk update
        // 6. update dah
        await userRepository.updateUser({
            "name": req.body.name,
            "kota": req.body.kota,
            "alamat": req.body.alamat,
            "no_hp": req.body.no_hp,
            "img":imageName
        }, userID);
        const { items: dataUser} = await userRepository.getOldValue(userID);
        // res.send(updateProfile);
        const responseUpdateProfile = {
            key: dataUser[0].key,
            email: dataUser[0].email,
            password: dataUser[0].password,
            name: dataUser[0].name,
            kota: dataUser[0].kota,
            alamat: dataUser[0].alamat,
            no_hp: dataUser[0].no_hp,
            img: `/img/${imageName}`
        }
        // console.log("key", updateProfile.key);
        responseLibrary(res, 200, responseUpdateProfile, "User Data completion success")
    }else{
        const getOldValue = await userRepository.getOldValue(userID)
        await userRepository.updateUser({
            "name": req.body.name,
            "kota": req.body.kota,
            "alamat": req.body.alamat,
            "no_hp": req.body.no_hp,
            "img": getOldValue.items[0].img
        }, userID);
        const { items: dataUser} = await userRepository.getOldValue(userID);
        // res.send(updateProfile);
        const responseUpdateProfile = {
            key: dataUser[0].key,
            email: dataUser[0].email,
            password: dataUser[0].password,
            name: dataUser[0].name,
            kota: dataUser[0].kota,
            alamat: dataUser[0].alamat,
            no_hp: dataUser[0].no_hp,
            img: `/img/${ dataUser[0].img}`
        }
        // console.log("key", updateProfile.key);
        responseLibrary(res, 200, responseUpdateProfile, "User Data completion success")
    }
}

async function logout(req, res){
    res.cookie('jwt', '', { maxAge: 1 });
    responseLibrary(res, 200, {}, "Logout Success")
}

async function getUserByKey(req, res){
    const { key } = req.query;
    const { items: user } = await userRepository.getOldValue(key);
    const dataUser = {
        "key": user[0].key,
        "name": user[0].name,
        "email": user[0].email,
        "kota": user[0].kota,
        "alamat": user[0].alamat,
        "no_hp": user[0].no_hp,
        "img": `/img/${user[0].img}`
    }
    responseLibrary(res, 200, dataUser, "Success get user data");
}
module.exports={
    updateUser,
    logout,
    getUserByKey
}
