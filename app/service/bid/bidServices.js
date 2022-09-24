const UserRepository = require("../../repository/UserRepository");
const ProductRepository = require("../../repository/ProductRepository");
const BidRepository = require("../../repository/BidRepository");
const NotificationRepository = require("../../repository/NotificationRepository");
const responseLibrary = require("../../library/response");
const numberWithCommas = require("../../library/numberWithCommas");

async function postBid(req, res) {
  const userID = req.user;
  const { key, bid } = req.body;
  const user = await UserRepository.getOldValue(userID);
  const product = await ProductRepository.getByKey(key);
  // res.send(product.items[0].seller);
  const buyerBid = {
    buyer: {
      key: user.items[0].key,
      name: user.items[0].name,
      kota: user.items[0].kota,
      img: `/img/${user.items[0].img}`,
      no_hp: user.items[0].no_hp,
    },
    bid: parseInt(bid),
    product: {
      key: product.items[0].key,
      name: product.items[0].name,
      category: product.items[0].category,
      price: product.items[0].price,
      img: product.items[0].img,
    },
    seller: {
      ...product.items[0].seller,
    },
    postedAt: Date.now(),
    updatedAt: Date.now(),
    status: "pending",
  };

  const sellerNotification = {
    user: {
      key: product.items[0].seller.key,
      buyerKey: userID
    },
    product: product.items[0],
    title: `${product.items[0].name} <br/> ${
      product.items[0].price
    } <br/> Ditawar Rp. ${numberWithCommas(bid)}`,
    type: "penawaran produk",
    postedAt: Date.now(),
    updatedAt: Date.now(),
    isRead: false,
    slug: "/user/penawaran/" + userID,
  };
  const bidResponse = await BidRepository.postBids(buyerBid);
  await NotificationRepository.bidNotifications(sellerNotification);

  responseLibrary(
    res,
    200,
    bidResponse,
    "Submit a new bid for a product, success"
  );
}

async function getBid(req, res) {
  const { userID } = req.user;
  const { key, status, buyerKey } = req.query;
  // console.log(key, status, buyerKey);

  if (status && key) {
    // key & status both exist
    console.log("produk key + status");
    const { items: bids } = await BidRepository.getBids(key, status, userID);
    responseLibrary(
      res,
      200,
      bids,
      "Success get bids by product key and status"
    );
  } else if (buyerKey && status) {
    // product key & status both exist
    console.log("buyer key + status");
    const { items: bids } = await BidRepository.getBidByBuyerandStatus(
      buyerKey,
      status,
      userID
    );
    responseLibrary(
      res,
      200,
      bids,
      "Success get bids by product key and status"
    );
  } else if (key) {
    console.log("hanya product key");
    // only product key that exist
    const { items: bids } = await BidRepository.getBidsNonStatus(key, userID);
    responseLibrary(res, 200, bids, "Success get bids by product key");
  } else if (buyerKey) {
    console.log("hanya buyer");
    // only buyer key that exist
    const { items: bids } = await BidRepository.getBidByBuyerandSeller(
      buyerKey,
      userID
    );
    responseLibrary(res, 200, bids, "Success get bids by buyer key");
  } else {
    responseLibrary(res, 404, [], "please insert some query");
  }
}

async function putBid(req, res) {
  const userID = req.user;
  const { key, status } = req.body;
  //mengambil data key ini statusnya apa, yang dijual sellernya
  const { items: bid, count } = await BidRepository.putBid(key, userID);

  if (count >= 1) {
    // ubah status bid ke accepted/rejected
    await BidRepository.updateBid(status, key);

    if (status === "accepted") {
      // update status bids bukan product (ini major) (fix dah)
      await ProductRepository.acceptProduct(bid[0].key);
      console.log(bid[0].key);

      const { items: product } = await ProductRepository.getByKey(
        bid[0].product.key
      );

      // buat notifikasi untuk user saja saat seller menerima bids
      const userNotification = {
        user: {
          key: bid[0].buyer.key,
        },
        product: product[0],
        title: `${bid[0].product.name}, Rp. ${bid[0].bid} dari ${bid[0].seller.name}`,
        type: "Penawaranmu diterima",
        postedAt: Date.now(),
        updatedAt: Date.now(),
        isRead: false,
        slug: ``,
      };

      await NotificationRepository.bidNotifications(userNotification);
    }

    if (status === "rejected" || status === "canceled") {
      // update status bids bukan product (ini major) (fix dah)
      await ProductRepository.rejectProduct(bid[0].key);
      console.log(bid[0].key);

      const { items: product } = await ProductRepository.getByKey(
        bid[0].product.key
      );

      // buat notifikasi untuk user saja saat seller menolak bids
      const userNotification = {
        user: {
          key: bid[0].buyer.key,
        },
        product: product[0],
        title: `${bid[0].product.name}, Rp. ${bid[0].bid} dari ${bid[0].seller.name}`,
        type: "Bid Penawaranmu ditolak",
        postedAt: Date.now(),
        updatedAt: Date.now(),
        isRead: false,
        slug: ``,
      };

      await NotificationRepository.bidNotifications(userNotification);
    }

    if (status === "delivered") {
      // update status product ke sold
      await ProductRepository.updateProduct(bid[0].product.key);

      // set bids yang statusnya accepted ke rejected
      const { items: bidsToBeRejected } = await BidRepository.bidAccepted(
        bid[0].product.key
      );
      const bidsToBeRejectedKey = bidsToBeRejected.map((bid) => bid.key);
      bidsToBeRejectedKey.forEach(async (bidKey) => {
        await BidRepository.updateRejected(bidKey);

        // buat notifikasi untuk buyer (bid ditolak)
        const { items: bidTobeRejected } = await BidRepository.getBidByKey(
          bidKey
        );
        const buyerNotification = {
          user: {
            key: bidTobeRejected[0].buyer.key,
          },
          product: bidTobeRejected[0].product,
          title: `${bidTobeRejected[0].product.name}, Rp. ${bidTobeRejected[0].bid} dari ${bidTobeRejected[0].seller.name}`,
          type: "Bid Penawaranmu ditolak",
          postedAt: Date.now(),
          updatedAt: Date.now(),
          isRead: false,
          slug: ``,
        };
        await NotificationRepository.bidNotifications(buyerNotification);
        // end buat notifikasi untuk buyer (bid ditolak)
      });
      //end set bids yang statusnya accepted ke rejected

      // set bids yang statusnya pending ke rejected
      const { items: bidsToBeRejected2 } = await BidRepository.bidPending(
        bid[0].product.key
      );
      const bidsToBeRejectedKey2 = bidsToBeRejected2.map((bid) => bid.key);
      bidsToBeRejectedKey2.forEach(async (bidKey) => {
        await BidRepository.updateRejected(bidKey);

        // buat notifikasi untuk buyer (bid ditolak)
        const { items: bidTobeRejected } = await BidRepository.getBidByKey(
          bidKey
        );
        const buyerNotification = {
          user: {
            key: bidTobeRejected[0].buyer.key,
          },
          product: bidTobeRejected[0].product,
          title: `${bidTobeRejected[0].product.name}, Rp. ${bidTobeRejected[0].bid} dari ${bidTobeRejected[0].seller.name}`,
          type: "Bid Penawaranmu ditolak",
          postedAt: Date.now(),
          updatedAt: Date.now(),
          isRead: false,
          slug: ``,
        };
        await NotificationRepository.bidNotifications(buyerNotification);
        // end buat notifikasi untuk buyer (bid ditolak)
      });
      //end set bids yang statusnya pending ke rejected

      // buat notifikasi untuk buyer (bid diterima)
      const buyerNotification = {
        user: {
          key: bid[0].buyer.key,
        },
        product: bid[0].product,
        title: `${bid[0].product.name}, Rp. ${bid[0].bid} dari ${bid[0].seller.name}`,
        type: "Berhasil dibeli",
        postedAt: Date.now(),
        updatedAt: Date.now(),
        isRead: false,
        slug: ``,
      };
      await NotificationRepository.bidNotifications(buyerNotification);
      // end buat notifikasi untuk buyer (bid diterima)
    }

    responseLibrary(res, 200, {}, `Update bid status to ${status}, success`);
  } else {
    responseLibrary(res, 404, {}, "that bid it's not exist");
  }
}

module.exports = {
  postBid,
  getBid,
  putBid,
};
