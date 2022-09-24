const { Deta } = require("deta");

// Project Key Deta
const deta = Deta("c0z67cdi_kWQ9Zit3svuv2fxXz8KmtGMFbSzediWP");
// access table
const db_notification = deta.Base("db_notifications");

async function postProductNotification(data) {
    const postProductNotif = await db_notification.put(data,
      (err, result) => {
        if (err) {
          return err;
        } else {
          return result;
        }
      }
    );
    return postProductNotif;
}

async function bidNotifications(data) {
  const bidNotification = await db_notification.put(data,
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return bidNotification;
}

async function userGetNotification(userID){
  const getNotification = await db_notification.fetch(
    {
      "user.key":userID
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return getNotification;
}

async function getNotificationByKey(key, userID){
  const getNotification = await db_notification.fetch(
  {
    key: key,
    "user.key": userID
  },(err, result) => {
    if (err) {
      return err;
    } else {
      return result;
    }
  });
  return getNotification;
}

async function updateIsRead(key){
  const updateNotification = await db_notification.update(
    {
      isRead: true, updatedAt: Date.now(),
    }, key);
  return updateNotification;
}

module.exports = {
    postProductNotification,
    bidNotifications,
    userGetNotification,
    getNotificationByKey,
    updateIsRead
}