// Logic
// Before: login aja langsung pake email erlinaeka@gmail.com
// Dapet token langsung login 

// kayaknya ini banyak deh ya, 1. Login seller (cari bid yang pending)
// Kalo mau makesure bid pendingnya ga 0, ya harus buat bid dulu
// Kalo mau make sure ya harus buat productnya juga

// berarti nanti nyimpen tokennya ada 2 

const request = require('supertest');
const app = "http://localhost:3001";
const userRepository = require('../../app/repository/UserRepository');
const BidRepository =  require('../../app/repository/BidRepository');

let userRegisterSeller;
let bid;
let product
let tokenBuyer;
let tokenRegister;
// daftar user yang bakalan upload produk
const email = "erlinaf@mail.com";
const name = "Erlina EFF";
const password = "erlinaf123";
// akun user yang bakalan nge-bid
const emailUser = "erlinaeka@gmail.com";
const passwordUser = "erlina123";

// untuk login yang berperan sebagai pembeli (akan nge-bid)
beforeAll(async () => {
    // 1. Daftar sebagai seller
    userRegisterSeller = await request(app).post("/users/signup").set("Content-Type", "application/json").send({ email, name, password });
    userRegisterSeller = userRegisterSeller.body.result;
          // a. seller login
    tokenRegister = await request(app).post("/users/login").set("Content-Type", "application/json").send({ email, password });
    tokenRegister = tokenRegister.body.result.token;
    // console.log('ini user', userRegisterSeller);
    console.log('ini token user', tokenRegister);
        //   b. seller upload product
//     product =  await request(app).post("/users/products").set("Authorization", `Bearer ${tokenRegister}`).set("Content-Type", "application/json").field("img", "uniqlo.jpg");
//     product = product.body.result;
//     // // 2. Login Akun buyer (Existing user)
//         tokenBuyer = await request(app).post("/users/login").set("Content-Type", "application/json").send({ "email":emailUser, "password":passwordUser });
//         tokenBuyer = tokenBuyer.body.result.token;
// //     // //       // a. bid product
//     await request(app).post("/users/bids").set("Authorization", `Bearer ${tokenBuyer}`).set("Content-Type", "application/json").send({key:product.key, bid:120000});
});

afterAll(async () => {
    //3. hapus data yang digunain buat test
    await userRepository.deleteUser(userRegisterSeller.key);
});


describe("Get Data Product Interested", () => {
    it("should response with 200", async () => {
        return request(app)
          .get("/users/products/interested")
          .set("Authorization", `Bearer ${tokenRegister}`)
          .then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                "message": " No Data Product ",
                "status": 200,
            });
        });
    });

});


