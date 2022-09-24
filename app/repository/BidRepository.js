const { Deta } = require("deta");

// Project Key Deta
const deta = Deta("c0z67cdi_kWQ9Zit3svuv2fxXz8KmtGMFbSzediWP");

// access table
const db_bid = deta.Base("db_bids");
const drive = deta.Drive("images");

async function postBids(buyerBid) {
  const postBid = await db_bid.put(buyerBid, (err, result) => {
    if (err) {
      return err;
    } else {
      return result;
    }
  });
  return postBid;
}

async function getBids(productKey, status, sellerKey) {
  const getBid = await db_bid.fetch(
    {
      "product.key": productKey,
      status: status,
      "seller.key": sellerKey,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return getBid;
}

async function getBidsNonStatus(productKey, sellerKey) {
  const getBid = await db_bid.fetch(
    {
      "product.key": productKey,
      "seller.key": sellerKey,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return getBid;
}

async function getBidByBuyerandStatus(buyerKey, status, userID) {
  const getBid = await db_bid.fetch(
    {
      "buyer.key": buyerKey,
      status: status,
      "seller.key": userID,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return getBid;
}

async function getBidByBuyerandSeller(buyerKey, userID) {
  const getBid = await db_bid.fetch(
    {
      "buyer.key": buyerKey,
      "seller.key": userID,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return getBid;
}

async function getBidsNonProductKey(status, sellerKey) {
  const getBid = await db_bid.fetch(
    {
      status: status,
      "seller.key": sellerKey,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return getBid;
}

async function putBid(bidKey, sellerKey) {
  const putBid = await db_bid.fetch(
    {
      key: bidKey,
      "seller.key": sellerKey,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return putBid;
}

async function getBidByUserID(sellerKey) {
  const putBid = await db_bid.fetch(
    {
      "seller.key": sellerKey,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return putBid;
}
async function updateBid(status, key) {
  const updateBid = await db_bid.update({ status: status }, key);
  return updateBid;
}

async function bidPending(productKey) {
  const getBid = await db_bid.fetch(
    {
      "product.key": productKey,
      status: "pending",
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return getBid;
}

async function bidAccepted(productKey) {
  const getBid = await db_bid.fetch(
    {
      "product.key": productKey,
      status: "accepted",
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return getBid;
}

async function updateRejected(bidKey) {
  const updateBid = await db_bid.update({ status: "rejected" }, bidKey);
  return updateBid;
}

async function getBidByKey(bidKey) {
  const getBid = await db_bid.fetch(
    {
      key: bidKey,
    },
    (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    }
  );
  return getBid;
}

module.exports = {
  postBids,
  getBids,
  putBid,
  updateBid,
  getBidsNonStatus,
  getBidsNonProductKey,
  getBidByUserID,
  bidPending,
  bidAccepted,
  updateRejected,
  getBidByKey,
  getBidByBuyerandStatus,
  getBidByBuyerandSeller,
};
