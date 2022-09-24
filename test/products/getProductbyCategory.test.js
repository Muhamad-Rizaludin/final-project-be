const request = require('supertest');
const app = "http://localhost:3001";

describe("Get product by category product", () => {
    it("should response with 200", async () => {
        const category = "baju";
        return request(app)
          .get(`/users/products/${category}`)
          .then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                "message": "Success get products from seller by status",
                "status": 200,
            });
        });
    });

});