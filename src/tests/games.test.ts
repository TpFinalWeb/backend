import { describe, expect, it, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import { Game } from '../models/game.model';
import connectToDb, { closeMongoConnectionTest } from '../utils/mongodb.utils';
import { UserService } from '../services/user.service';

const beginningHttpLink: string = '/games'; 
const message200: string = 'should return 200 OK';
const message201: string = 'should return 201 CREATED';
const message400: string = 'should return 400 BAD REQUEST';
const message404: string = 'should return 404 NOT FOUND';
const message500: string = 'should return 500 INTERNAL SERVER ERROR';

var tokenAdmin: string;
var tokenUser: string;

beforeAll(async () => {
  try {
    await connectToDb();
    tokenAdmin = await UserService.loginUser("admin@mail.com", "#Admin123")
    tokenUser = await UserService.loginUser("test@gmail.com", "#Test123")
    console.log(tokenAdmin)
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  try {
    await closeMongoConnectionTest();
  } catch (error) {
    console.log(error);
  }
});

describe(`Testing game routes`, function () {
  describe(`GET ${beginningHttpLink}/:id`, function () {
    it(message200, function (done) {
      // Fetch the last created game from the database
      Game.find().sort({ _id: -1 }).limit(1)
        .then(createdGame => {
            const lastGameId = createdGame[0]._id;
            request(app)
              .get(`${beginningHttpLink}/${lastGameId}`)
              .set('Authorization', `bearer ${tokenAdmin}`)
              .expect(200)
              .then(response => {
                expect(response.body).toHaveProperty('name');
                done();
              })
        })
    }, 10000);
    it(message404, function (done) {
      const invalidGameId = 'invalid-game-id';
      request(app)
        .get(`${beginningHttpLink}/${invalidGameId}`)
        .set('Authorization', `bearer ${tokenAdmin}`)
        .expect(404, done)
    });
  });
  

  describe(`POST ${beginningHttpLink}/`, function () {
    it(message201, function (done) {
      request(app)
        .post(`${beginningHttpLink}`)
        .set('Authorization', `bearer ${tokenAdmin}`)
        .send({
          name: "The Legend of Zelda: Breath of the wild",
          detailed_description: "An open-world action-adventure game developed by Nintendo.",
          num_vote: 1500,
          score: 9.5,
          sample_cover: {
            height: 1024,
            width: 768,
            image: "https://example.com/images/zelda_cover.jpg",
            thumbnail_image: "https://example.com/images/zelda_thumb.jpg",
            platforms: [
              "Nintendo Switch",
              "Wii U",
              "Windows",
            ]
          },
          genres: [
            {
              genre_category: "Adventure",
              genre_category_id: 10,
              genre_id: 100,
              genre_name: "Action-Adventure"
            },
            {
              genre_category: "Fantasy",
              genre_category_id: 11,
              genre_id: 101,
              genre_name: "Fantasy Adventure"
            }
          ],
          platforms: [
            {
              platform_id: 1,
              platform_name: "Nintendo Switch",
              first_release_date: "2017-03-03"
            },
            {
              platform_id: 2,
              platform_name: "Wii U",
              first_release_date: "2017-03-03"
            }
          ]
        })
        .expect(201, done);
    });

    it(message400, function (done) {
      request(app)
        .post(`${beginningHttpLink}`)
        .set('Authorization', `bearer ${tokenAdmin}`)
        .send({
          detailed_description: 'This is a test game description.',
          num_vote: 0,
          score: 10,
          sample_cover: {
            height: 300,
            width: 200,
            image: 'http://example.com/image.jpg',
            thumbnail_image: 'http://example.com/thumbnail.jpg',
            platforms: ['PC']
          },
          genres: [{
            genre_category: 'Action',
            genre_category_id: 1,
            genre_id: 1,
            genre_name: 'Adventure'
          }],
          platforms: [{
            platform_id: 1,
            platform_name: 'PC',
            first_release_date: '2023-12-01'
          }]
        })
        .expect(400, done);
    });
  });

  describe(`PUT ${beginningHttpLink}/:id`, function () {
    it(message200, function (done) {
      // Fetch the last created game to get its ID
      Game.find().sort({ _id: -1 }).limit(1).then(createdGame => {
          const testGameId = createdGame[0]._id;
          request(app)
            .put(`${beginningHttpLink}/${testGameId}`)
            .set('Authorization', `bearer ${tokenAdmin}`)
            .send({
              name: "The Legend of Zelda: Breath of the wildest",
              detailed_description: "An open-world action-adventure game developed by Nintendo.",
              num_vote: 1500,
              score: 9.5,
              sample_cover: {
                  height: 1024,
                  width: 768,
                  image: "https://example.com/images/zelda_cover.jpg",
                  thumbnail_image: "https://example.com/images/zelda_thumb.jpg",
                  platforms: [
                      "Nintendo Switch"
                  ]
              },
              genres: [
                  {
                      genre_category: "Adventure",
                      genre_category_id: 10,
                      genre_id: 100,
                      genre_name: "Action-Adventure"
                  }
              ],
              platforms: [
                  {
                      platform_id: 1,
                      platform_name: "Nintendo Switch",
                      first_release_date: "2017-03-03"
                  }
              ]
          })
            .expect(200, done);
        }
      )
    });

    it(message404, function (done) {
      const nonExistentId = '675616f2187a7ab1b0aabcde';
      request(app)
        .put(`${beginningHttpLink}/${nonExistentId}`)
        .set('Authorization', `bearer ${tokenAdmin}`)
        .send({
          name: "The Legend of Zelda: Breath of the wildest",
          detailed_description: "An open-world action-adventure game developed by Nintendo.",
          num_vote: 1500,
          score: 9.5,
          sample_cover: {
              height: 1024,
              width: 768,
              image: "https://example.com/images/zelda_cover.jpg",
              thumbnail_image: "https://example.com/images/zelda_thumb.jpg",
              platforms: [
                  {
                      platform_id: 1,
                      platform_name: "Nintendo Switch",
                      first_release_date: "2017-03-03"
                  }
              ]
          },
          genres: [
              {
                  genre_category: "Adventure",
                  genre_category_id: 10,
                  genre_id: 100,
                  genre_name: "Action-Adventure"
              }
          ],
          platforms: [
              {
                  platform_id: 1,
                  platform_name: "Nintendo Switch",
                  first_release_date: "2017-03-03"
              }
          ]
      })
        .expect(404, done);
    });
  });
  
  describe(`DELETE ${beginningHttpLink}/:id`, function () {
    it(message200, function (done) {
      // Fetch the last created game to get its ID
      Game.find().sort({ _id: -1 }).limit(1)
        .then(createdGame => {
            const testGameId = createdGame[0]._id;
            request(app)
              .delete(`${beginningHttpLink}/${testGameId}`)
              .set('Authorization', `bearer ${tokenAdmin}`)
              .expect(204, done)
        })
    });
    it(message404, function (done) {
      const invalidGameId = '675cb11ce49273bb551cb3de';
      request(app)
        .delete(`${beginningHttpLink}/${invalidGameId}`)
        .set('Authorization', `bearer ${tokenAdmin}`)
        .expect(500, done)
    });
  });
  
});
