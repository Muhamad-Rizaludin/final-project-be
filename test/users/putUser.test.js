const request = require('supertest');
const app = "http://localhost:3001";
const userRepository = require('../../app/repository/UserRepository');

let token;
let user;
const email = "erlinafitrian@gmail.com";
const name = "Erlina EF"
const password = "erlinafitrian123";

beforeAll(async () => {
    //1. daftar dulu
    user = await request(app).post("/users/signup").set("Content-Type", "application/json").send({ email, name, password });
    user = user.body.result;
    // console.log(user)
    //2. Terus login deh
    token = await request(app).post("/users/login").set("Content-Type", "application/json").send({ email, password });
    token = token.body.result.token;
});

afterAll(async () => {
    //3. hapus data yang digunain buat test
    await userRepository.deleteUser(user.key);
})

describe("Endpoint Update profile user integration test", () => {
    it("should response with 200", async () => {
        const img = "gambarava.jpg";
        const kota = "Surabaya";
        const alamat = "Jl. Ahmad Yani";
        const no_hp = "085612713123";
        const name = "Erlina Eka Fitriani";
        return request(app)
          .put("/users")
          .set("Authorization", `Bearer ${token}`)
          .set("Content-Type", "application/json")
          .send({ img, kota, alamat, no_hp, name })
          .then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                "message": "User Data completion success",
                "result": {
                    "name": name,
                    "email": user.email,
                    "alamat": alamat,
                    "no_hp": no_hp,
                    "kota": kota
                },
                "status": 200,
            });
        });
    });

});