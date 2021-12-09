import request from 'supertest';
import { app } from "./app";

it('should throw an error for a route that doesnt exist', async () => {
    await request(app)
        .get('/api/orders/test')
        .send()
        .expect(404);
})