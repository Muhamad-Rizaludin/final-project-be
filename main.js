require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const signupService = require("./app/service/authentication/signup");
const loginService = require("./app/service/authentication/login");
const productService = require("./app/service/product/productServices");
const userService = require("./app/service/user/userServices");
const bidService = require("./app/service/bid/bidServices");
const notificationService = require("./app/service/notification/notificationServices");
const auth = require("./app/middleware/checkUser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/openapi.json");
// nb: kalo pake cloudinary use upload ini dihapus
const upload = require("express-fileupload");

const app = express();
// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
// nb: kalo pake cloudinary use upload ini dihapus
app.use(upload());

//Home
app.get("/", productService.home);

//api-users
app.post("/users/signup", signupService);
app.post("/users/login", loginService);
app.put("/users", auth.verifToken, userService.updateUser);
app.get("/users", auth.verifToken, userService.getUserByKey);

//api-product
app.post("/users/products", auth.verifToken, productService.postProduct);
app.get("/users/products", auth.verifToken, productService.userProduct);
app.get("/users/products/interested", auth.verifToken, productService.interestedProduct);
app.get("/users/products/:category", productService.productCategory);

//api-bid
app.post("/users/bids", auth.verifToken, bidService.postBid);
app.get("/users/bids", auth.verifToken, bidService.getBid);
app.put("/users/bids", auth.verifToken, bidService.putBid);

//api-notification
app.get("/users/notifications", auth.verifToken, notificationService.getNotification );
app.put("/users/notifications",auth.verifToken,notificationService.putNotification);

app.get("/img/:name", productService.getImg);
app.use("/open-api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT || process.env.PORT_API, () => {
  console.log(`API running on port ${process.env.PORT_API}`);
});
