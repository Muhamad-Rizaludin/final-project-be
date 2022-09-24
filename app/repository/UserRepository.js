const bcrypt = require("bcrypt");
const req = require("express/lib/request");
const { Deta } = require("deta");

// Project Key Deta
const deta = Deta("c0z67cdi_kWQ9Zit3svuv2fxXz8KmtGMFbSzediWP");
// access table
const db_user = deta.Base("db_users");
// drive
const drive = deta.Drive("images");

async function registerUser(dataUser) {
  const registerUser = await db_user.put(
    {
      email: dataUser.email,
      name: dataUser.name,
      password: bcrypt.hashSync(dataUser.password, 10),
      kota: "",
      alamat: "",
      no_hp: null,
      img: "",
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return registerUser;
}

async function checkEmail(emailUser) {
  const checkEmail = await db_user.fetch(
    {
      email: emailUser,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return checkEmail;
}

function checkPassword(encriptPassword, userPassword) {
  return bcrypt.compareSync(encriptPassword, userPassword);
}

async function checkName(nameUser) {
  const checkName = await db_user.fetch(
    {
      name: nameUser,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return checkName;
}

async function getOldValue(UserID) {
  const getOldValue= await db_user.fetch(
    {
      key: UserID,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return getOldValue;
}

async function updateProfile(updateData){
  const updateProfile = await db_user.put(updateData);
  return updateProfile;
}

async function updateUser(updateData, key){
  const updateUser = await db_user.update({
    name: updateData.name,
    kota: updateData.kota,
    alamat: updateData.alamat,
    no_hp: updateData.no_hp,
    img: updateData.img
  }, key);
  return updateUser;
}

async function uploadImg(imageName, imageData){
  const img = await drive.put(imageName, {data: imageData});
  return img;
}

async function deleteImg(imageName){
  const img = await drive.delete(imageName);
  return img;
}

async function deleteUser(userKey){
  const deleteUser = await db_user.delete(userKey);
  return deleteUser;
}


module.exports = {
  registerUser,
  checkEmail,
  checkPassword,
  checkName,
  updateProfile,
  getOldValue,
  uploadImg,
  deleteImg,
  updateUser,
  deleteUser
};
