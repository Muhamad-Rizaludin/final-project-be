const productRepository = require("../../repository/ProductRepository");
const BidRepository = require("../../repository/BidRepository");
const UserRepository = require("../../repository/UserRepository");
const NotificationRepository = require("../../repository/NotificationRepository");
const authorization = require("../../library/authorization");
const responseLibrary = require("../../library/response");
const slugify = require("slugify");
const numberWithCommas = require("../../library/numberWithCommas");

async function userProduct(req, res) {
  // 1. Ambil UserID yang dari token
  const userID = req.user;
  const { status, lastKey, limit } = req.query;
  // res.send(req.query.status);
  try {
    const getAllProduct = await productRepository.getAllProduct(
      userID,
      status,
      lastKey,
      limit
    );
    if (getAllProduct.items.length >= 1) {
      res.json({
        status: 200,
        result: getAllProduct.items,
        lastKey: getAllProduct.last || "",
        message: "Success get products from seller by status",
      });
    } else {
      responseLibrary(res, 200, [], " No Data Product ");
    }
  } catch (error) {
    console.log("error", error);
  }
}

async function interestedProduct(req, res) {
  // 1. Ambil UserID yang dari token
  const userID = req.user;
  const { lastKey, limit } = req.query;

  // // res.send(req.query.status);
  try {
    const resultProduct = await productRepository.bidProduct(userID);
    // res.send(resultProduct);
    // dapatkan key product
    if (resultProduct.count > 1) {
      // panggil data produk assign to array
      var product = [];
      var productInterest = [];
      for (var i = 0; i < resultProduct.count; i++) {
        productInterest.push(resultProduct.items[i].product.key);
      }
      var uniqueProductInterest = [...new Set(productInterest)];
      for (var i = 0; i < uniqueProductInterest.length; i++) {
        const getProduct = await productRepository.interestedProduct(
          uniqueProductInterest[i],
          limit,
          lastKey
        );
        product.push(getProduct.items[0]);
      }
      responseLibrary(
        res,
        200,
        product,
        "Success get products from seller by status"
      );
    } else if (resultProduct.count === 1) {
      const getProduct = await productRepository.interestedProduct(
        resultProduct.items[0].product.key,
        limit,
        lastKey
      );
      res.json({
        status: 200,
        result: getProduct.items,
        lastKey: getProduct.last || "",
        message: "Success get products from seller by status",
      });
    } else {
      responseLibrary(res, 200, [], " No Data Product ");
    }
  } catch (error) {
    console.log("error", error);
  }
}

async function productCategory(req, res) {
  try {
    const { category } = req.params;
    const { limit, lastKey } = req.query;
    const status = "active";
    const getByCategory = await productRepository.getByCategory(
      category,
      status,
      limit,
      lastKey
    );
    if (getByCategory.items.length >= 1) {
      res.json({
        status: 200,
        result: getByCategory.items,
        lastKey: getByCategory.last || "",
        message: "Success get products from seller by status",
      });
    } else {
      responseLibrary(res, 200, [], " No Data Product ");
    }
  } catch (error) {
    console.log("error", error);
  }
}

async function home(req, res) {
  const { lastKey, limit, name } = req.query;
  try {
    if (name) {
      const getProduct = await productRepository.homeProduct(
        name,
        limit,
        lastKey
      );
      if (getProduct.count) {
        res.json({
          status: 200,
          result: getProduct.items,
          lastKey: getProduct.last || "",
          message: "Success get products from seller by status",
        });
      } else {
        res.json({
          status: 200,
          result: getProduct.items,
          lastKey: getProduct.last || "",
          message: "Success get products from seller by status",
        });
      }
    } else {
      const getProduct = await productRepository.homeByStatus(limit, lastKey);
      res.json({
        status: 200,
        result: getProduct.items,
        lastKey: getProduct.last || "",
        message: "Success get products from seller by status",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500);
  }
}

async function postProduct(req, res) {
  // res.send(req.user);
  const userID = req.user;
  const { name, category, price, description } = req.body;

  // panggil db user untuk mendapatkan data user
  const user = await UserRepository.getOldValue(userID);
  console.log(user);

  const productUser = await productRepository.countUserProduct(userID);

  if(productUser.count<4){
    const imgs = req.files.img;
    const img = [];
    if (imgs.length > 1) {
      imgs.forEach(async ({ name, data, md5 }) => {
        const [tmpName, extention] = name.split(".");
        const savedName = `${md5}-${Date.now()}.${extention}`;
        img.push(`/img/${savedName}`);
        await productRepository.uploadProductImg(savedName, data);
      });
    } else {
      const [tmpName, extention] = imgs.name.split(".");
      const savedName = `${imgs.md5}-${Date.now()}.${extention}`;
      img.push(`/img/${savedName}`);
      await productRepository.uploadProductImg(savedName, imgs.data);
    }
  
    const product = {
      seller: {
        key: user.items[0].key,
        name: user.items[0].name,
        kota: user.items[0].kota,
      },
      name,
      category,
      price: numberWithCommas(price),
      description,
      img,
      //   slug: '/'+slugify(name, {
      //     replacement: '-',
      //     lower: true,
      //   }),
      slug: `/${user.items[0].key}`,
      status: "active",
    };
  
    // notification when post product success
    const sellerNotification = {
      user: {
        key: user.items[0].key,
      },
      product,
      title: `${name} <br/> Rp.${numberWithCommas(price)}`,
      type: "berhasil diterbitkan",
      postedAt: Date.now(),
      updatedAt: Date.now(),
      isRead: false,
      slug: `/product/${user.items[0].name}/${user.items[0].key}`,
    };
  
    //tambahkan ke tabel product
    const response = await productRepository.postProduct(product);
    console.log("response", response);
  
    sellerNotification.slug = `/product/${user.items[0].name}/${response.key}`;
    const notificationResponse = sellerNotification;
  
    // tambahkan ke tabel Notification
    await NotificationRepository.postProductNotification(notificationResponse);
  
    responseLibrary(res, 200, response, "Submit a new product success");

  }else{
    responseLibrary(res, 500, [], "You only can post max 4 product to sell")
  }

}

async function getImg(req, res) {
  try {
    const name = req.params.name;
    const img = await productRepository.getProductImg(name);
    console.log('img', img)
    // if null return empty string below
    const buffer = (await img.arrayBuffer()) || "";
    console.log('buffer', buffer)
    if (buffer !== "") {
      res.send(Buffer.from(buffer));
    }else{
      res.send("")
    } 
  } catch (error) {
    res.send("")
  }
  
}

module.exports = {
  userProduct,
  productCategory,
  home,
  postProduct,
  getImg,
  interestedProduct,
};
