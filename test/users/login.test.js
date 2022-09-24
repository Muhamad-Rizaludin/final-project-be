const request = require('supertest');
const app = "http://localhost:3001";

describe("Login", () => {
    it("should response with 200 as status code", async () => {
      const email = "binar@mail.com";
      const password = "rahasia";
  
      return request(app)
        .post("/users/login")
        .set("Content-Type", "application/json")
        .send({ email, password })
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body).toMatchObject({
            "message":"Login Success",
            "status": 200
          });

          // nota: pake tomatchobject, karena kalo pake objectcontaining tuh mesti semua respon terdefinisikan
        });
    });

    it("should response with 400 as status code, because email not registered", async () => {
        const email = "erlinaekaf@mail.com";
        const password = "rahasia";
    
        return request(app)
          .post("/users/login")
          .set("Content-Type", "application/json")
          .send({ email, password })
          .then((res) => {
            expect(res.statusCode).toBe(400);
            expect(res.body).toMatchObject({
              "message":"Login Failed",
              "status": 400
            });
  
            // nota: pake tomatchobject, karena kalo pake objectcontaining tuh mesti semua respon terdefinisikan
        });
    });

    it("should response with 400 as status code, because password wrong", async () => {
        const email = "erlinaeka@gmail.com";
        const password = "rahasia";
    
        return request(app)
          .post("/users/login")
          .set("Content-Type", "application/json")
          .send({ email, password })
          .then((res) => {
            expect(res.statusCode).toBe(400);
            expect(res.body).toMatchObject({
              "message":"Login Failed",
              "status": 400
            });
  
            // nota: pake tomatchobject, karena kalo pake objectcontaining tuh mesti semua respon terdefinisikan
        });
    });

});
