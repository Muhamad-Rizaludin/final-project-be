const request = require('supertest');
const ProductRepository = require('../app/repository/ProductRepository');
const app = "http://localhost:3001";

describe('Endpoint Home integration test', () => {
  describe('GET /', () => {
    let product = {
      key: "qwqeeqwq",
      name: "Baju Denim",
      category: "Baju",
      price: 90000,
      description: "Baju Denim Preloved",
      img: "srfrfss.jpg",
    };

    beforeEach(async () => {
      product = await ProductRepository.postProduct(
        product
      );
      return product;
    });
    
    afterEach(async () => {
      product = await ProductRepository.deleteProduct(
        product.key
      );
      return product;
    });

    it('should return success if using valid data', async () => {
      return request(app)
      .get('/')
      .expect((res) => {
        // eslint-disable-next-line no-unused-expressions
          res.body.result.length > 1;
        });
    })
  })


})
