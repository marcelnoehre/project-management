import * as request from 'supertest';
import * as app from './index';

describe("GET /api-docs", () => {
  it("should return that the server is running", async () => {
    const res = await request(app)
    .get("/")
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200);

    expect(res.statusCode).toBe(200);
  });

  it("should return the swagger documentation", async () => {
    const res = await request(app)
    .get("/api-docs")
    .expect('Content-Type', 'text/html; charset=UTF-8')
    .expect(301);

    expect(res.statusCode).toBe(301);
  });
});
