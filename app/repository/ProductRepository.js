const req = require("express/lib/request");
const { Deta } = require("deta");

// Project Key Deta
const deta = Deta("c0z67cdi_kWQ9Zit3svuv2fxXz8KmtGMFbSzediWP");

// access table
const db_product = deta.Base("db_products");
const db_bid = deta.Base("db_bids");
const drive = deta.Drive("images");

async function getAllProduct(userID, status, lastKey, limit) {
  const { items, last } = await db_product.fetch(
    {
      "seller.key": userID,
      status: status,
    },
    { limit: parseInt(limit), last: lastKey }
  );
  return { items, last };
}

async function getByCategory(productCategory, statusProduct, limit, lastKey) {
  const { items, last } = await db_product.fetch(
    {
      category: productCategory,
      status: statusProduct,
    },
    { limit: parseInt(limit), last: lastKey }
  );
  return { items, last };
}

async function homeByStatus(limit, lastKey) {
  const homeByStatus = await db_product.fetch(
    {
      status: "active",
    },
    {
      limit: parseInt(limit),
      last: lastKey,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return homeByStatus;
}

async function homeProduct(name, limit, lastKey) {
  const homeProduct = await db_product.fetch(
    {
      status: "active",
      "name?contains": name,
    },
    {
      limit: parseInt(limit),
      last: lastKey,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return homeProduct;
}

async function productById(productKey) {
  const productById = await db_product.fetch(
    {
      key: productKey,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return productById;
}

async function postProduct(dataProduct) {
  const postDataProduct = await db_product.put(dataProduct, (err, result) => {
    if (err) {
      return err;
    } else {
      return result;
    }
  });
  return postDataProduct;
}

async function uploadProductImg(name, data) {
  const uploadImg = await drive.put(name, { data });
  return uploadImg;
}

async function getProductImg(name) {
  const getImg = await drive.get(name);
  return getImg;
}

async function getByKey(productKey) {
  const product = await db_product.fetch(
    {
      key: productKey,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return product;
}

async function updateProduct(key) {
  const updateProduct = await db_product.update({ status: "sold" }, key);
  return updateProduct;
}

async function cancelProduct(key) {
  // sebelumnya db_product tapi sudah diganti ke db_bid
  const cancelProduct = await db_bid.update({ status: "pending" }, key);
  return cancelProduct;
}

async function acceptProduct(key) {
  const cancelProduct = await db_bid.update({ status: "accepted" }, key);
  return cancelProduct;
}

async function rejectProduct(key) {
  const rejectProduct = await db_bid.update({ status: "rejected" }, key);
  return rejectProduct;
}

async function bidProduct(userID) {
  // sebelumnya db_product tapi sudah diganti ke db_bid
  const getbidProduct = await db_bid.fetch({
    "seller.key": userID,
    status: "pending",
  });
  return getbidProduct;
}

async function interestedProduct(productKey, limit, lastKey) {
  const productStatus = await db_product.fetch(
    {
      key: productKey,
      status: "active",
    },
    {
      limit: parseInt(limit),
      last: lastKey,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return productStatus;
}

async function deleteProduct(productKey){
  const deleteProduct = await db_product.delete(productKey);
  return deleteProduct;
}

async function countUserProduct(userKey){
  const productUser = await db_product.fetch({
    "seller.key": userKey,
    status:"active"
  });
  return productUser;
}

module.exports = {
  getAllProduct,
  getByCategory,
  postProduct,
  uploadProductImg,
  getProductImg,
  getByKey,
  updateProduct,
  productById,
  homeByStatus,
  homeProduct,
  cancelProduct,
  acceptProduct,
  rejectProduct,
  interestedProduct,
  bidProduct,
  deleteProduct,
  countUserProduct
};
