const request = require('supertest');
const app = require('../../app');
const { 
    connectMongoose, 
    disconnectMongoose 
} = require('../../services/mongo');

/** API TESTS */

describe('Launches API test', () => {

    beforeAll(async() => {
        await connectMongoose();
    });

    afterAll(async() => {
        await disconnectMongoose();
    });

    describe('Test GET /launches', () => {
        test('Response code should be 200 success', async() => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
            // expect(response.statusCode).toBe(200);
        });
    });
    
    
    describe('Test POST /launches', () => {
        
        const requestData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2028'
        };
        const requestDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
        };
    
        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate: 'zoot',
        };
    
        test('Response code should be 201 created', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(requestData)
                .expect('Content-Type', /json/)
                .expect(201);
    
            const requestedDate = new Date(requestData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(requestedDate).toBe(responseDate);
            expect(response.body).toMatchObject(requestDataWithoutDate);
    
        });

        test('It should catch missing required properties', async () => {
            const response = await request(app)
              .post('/v1/launches')
              .send(requestDataWithoutDate)
              .expect('Content-Type', /json/)
              .expect(400);
        
            expect(response.body).toStrictEqual({
              error: 'Missing required launch property',
            });
        });

        test('It should catch invalid dates', async () => {
            const response = await request(app)
              .post('/v1/launches')
              .send(launchDataWithInvalidDate)
              .expect('Content-Type', /json/)
              .expect(400);
        
            expect(response.body).toStrictEqual({
              error: 'Invalid launch date',
            });
        });
    
        
    });

});
