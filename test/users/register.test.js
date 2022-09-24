const request = require('supertest');
const app = "http://localhost:3001";
const userRepository = require('../../app/repository/UserRepository');

describe("Register Success", () => {
    let user;
    afterEach(async () => {
      user = await userRepository.checkEmail(
        "erlinaf@mail.com"
      );
      const userDelete = await userRepository.deleteUser(user.items[0].key)
      return userDelete;
    });
    it("should response with 200 as status code", async () => {
      const email = "erlinaf@mail.com";
      const name = "Erlina Eka F"
      const password = "rahasia";
  
      return request(app)
        .post("/users/signup")
        .set("Content-Type", "application/json")
        .send({ email, name, password })
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body).toMatchObject({
            "message":"Register Success, New user is created",
            "status": 200
          });

          // nota: pake tomatchobject, karena kalo pake objectcontaining tuh mesti semua respon terdefinisikan
        });
    });
});

describe("Register Failed", () => {
  it("should response with 409 as status code, because email already taken by another user", async () => {
    const email = "binar@mail.com";
    const name = "Erlina Eka F"
    const password = "rahasia";

    return request(app)
      .post("/users/signup")
      .set("Content-Type", "application/json")
      .send({ email, name, password })
      .then((res) => {
        expect(res.statusCode).toBe(409);
        expect(res.body).toMatchObject({
          "message": "Register Failed, Email already registered",
          "status": 409
        });

        // nota: pake tomatchobject, karena kalo pake objectcontaining tuh mesti semua respon terdefinisikan
      });
  });

});