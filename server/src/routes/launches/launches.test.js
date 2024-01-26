const request = require('supertest');
const app = require('../../app');

/** API TESTS */

describe('Test GET /launches', () => {
    test('Response code should be 200 success', async() => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        // expect(response.statusCode).toBe(200);
    })
})


describe('Test POST /launches', () => {
    const requestData = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
        launchDate: 'January 4, 2028'
    };
    const requestDataWithoutDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
    };

    test('Response code should be 201 created', async() => {
        const response = await request(app)
            .post('/launches')
            .send(requestData)
            .expect('Content-Type', /json/)
            .expect(201);

        const requestedDate = new Date(requestData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(requestedDate).toBe(responseDate);
        expect(response.body).toMatchObject(requestDataWithoutDate);
    })




    
})