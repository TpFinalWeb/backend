import {describe, expect, test} from '@jest/globals';
import request from 'supertest';
import app from '../app';
import { User } from '../models/user.model';
import connectToDb, { closeMongoConnectionTest } from '../utils/mongodb.utils';


const beginningHttpLink: string = '';
const message200: string = 'should return 200 OK';
const message201: string = 'should return 201 CREATED';
const message400: string = 'should return 400 BAD REQUEST';
const message401: string = 'should return 401 UNAUTHORIZED';

var numberOfTestUsers: number = 0;

beforeAll(async () => {
  try {
    connectToDb();
    numberOfTestUsers = await User.countDocuments();
  } catch (error) {
    console.log(error);
  }
})

afterAll(async () => {
  try{
    closeMongoConnectionTest();
  }catch(error){}
})

describe(`Testing user routes`, function () {
  describe(`POST ${beginningHttpLink}/register`, function () {
    // correct
    it(message201, function (done) {
      request(app)
      .post(`${beginningHttpLink}/register`)
      .send({
        role: "gestionnaire",
        email: `gestionnaire${numberOfTestUsers}@gmail.com`,
        username: `Gestionnaire${numberOfTestUsers}`,
        password: "G%#*5ghiut82eiuhr3$%#Gt4e6",
      })
      .expect(201, done);
    });

    // missing field
    it(message400, function (done) {
      request(app)
      .post(`${beginningHttpLink}/register`)
      .send({
          role: "gestionnaire",
          username: `Gestionnaire${numberOfTestUsers}`,
          password: "G%#*5ghiut82eiuhr3$%#Gt4e6",
      })
      .expect(400, done);
    })

    // missing password
    it(message400, function (done) {
      request(app)
      .post(`${beginningHttpLink}/register`)
      .send({
          role: "gestionnaire",
          email: `gestionnaire${numberOfTestUsers}@gmail.com`,
          username: `Gestionnaire${numberOfTestUsers}`,
      })
      .expect(400, done);
    })
  });

  describe(`POST ${beginningHttpLink}/login ()`, function () {
    //correct
    it(message200, function (done) {
        request(app)
        .post(`${beginningHttpLink}/login`)
        .send({
            email: `gestionnaire${numberOfTestUsers}@gmail.com`,
            password: "G%#*5ghiut82eiuhr3$%#Gt4e6"
        })
        .expect(200, done);
    })

    // missing field
    it(message400, function (done) {
        request(app)
        .post(`${beginningHttpLink}/login`)
        .send({
            email: `gestionnaire${numberOfTestUsers - 1}@gmail.com`
        })
        .expect(400, done);
    })

    // wrong password
    it(message401, function (done) {
        request(app)
        .post(`${beginningHttpLink}/login`)
        .send({
            email: `gestionnaire${numberOfTestUsers - 1}@gmail.com`,
            password: "#WrongPassword123"
        })
        .expect(401, done);
    })
})
})