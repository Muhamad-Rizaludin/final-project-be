const request = require('supertest');
const app = "http://localhost:3001";

let token;
let key;
const email = "erlinaeka@gmail.com";
const password = "erlina123";

beforeAll(async () => {
  token = await request(app).post("/users/login").set("Content-Type", "application/json").send({ email, password });
  key = token.body.result.key;
  token = token.body.result.token;
  return token;
});

describe("Endpoint getUser by key user integration test", () => {
    it("should response with 200", async () => {
        return request(app)
          .get("/users")
          .set("Content-Type", "application/json")
          .send({ key })
          .set("Authorization", `Bearer ${token}`)
          .then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                "message": "Success get user data",
                "status": 200,
            });
        });
    });

});