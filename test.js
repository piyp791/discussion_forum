var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../main');
var httpMocks = require('node-mocks-http');
var validation = require('../public/validation.js')
var should = chai.should();

chai.use(chaiHttp);

describe('Login', function() {
  this.timeout(5000);

  it('should validate the email in the login form', function(done){

    //
    if(!validation){
      console.log('validation object is false')
    }else{
      validation()
    }
    chai.request(server)
    .post('/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    //.set('Content-Type', 'application/json; charset=utf-8')
    .send({'email': 'e', 'password': '1', 'op':'login'})
    .end(function(err, res){
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.be.array;
      done();
    });
  });

  it('should validate the input in login form', function(done){
    chai.request(server)
    .post('/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    //.set('Content-Type', 'application/json; charset=utf-8')
    .send({'email': 'e', 'password': '1', 'op':'login'})
    .end(function(err, res){
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.be.array;
      done();
    });
  });

  it('should get a user from DB', function(done){
    chai.request(server)
    .post('/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    //.set('Content-Type', 'application/json; charset=utf-8')
    .send({'email': 'e', 'password': '1', 'op':'login'})
    .end(function(err, res){
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.be.array;
      done();
    });
  });

  it('Should get an error response', function(done){
    chai.request(server)
    .post('/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({'email': 'e', 'password': '2', 'op':'login'})
    .end(function(err, res){
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.be.array;
      res.body.should.be.empty;
      done();
    });
  });
});
