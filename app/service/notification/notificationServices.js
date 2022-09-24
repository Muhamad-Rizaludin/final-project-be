const NotificationRepository = require("../../repository/NotificationRepository");
const responseLibrary = require("../../library/response");

async function getNotification(req, res){
    const userID = req.user;
    const { items: notifications } = await NotificationRepository.userGetNotification(userID);
    responseLibrary(res, 200, notifications, "Success get notifications by user")
}

//ngerubah status read
async function putNotification(req, res){
    const userID = req.user;
    const keyNotification = req.body.key;

    const { count, items } = await NotificationRepository.getNotificationByKey(keyNotification, userID)
    if(count){
        await NotificationRepository.updateIsRead(keyNotification);
        responseLibrary(res, 200, { ...items[0], isRead: true, updatedAt: Date.now() }, "Success update notification isRead property to true");
    }else{
        responseLibrary(res, 404, {}, "that notification it's not exist");
    }
}


module.exports = {
    getNotification,
    putNotification
}