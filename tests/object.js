require('dotenv').load();

if (process.env.NODE_ENV !== 'test'){
  console.log('Current environment is not set for test.');
  process.exit();
}

let db    = require('../config/database')['test'];
let dbURL = "http://" + db.user + ":" + db.pass + "@" + db.host + ":" + db.port + "/" + db.name; 

let chai     = require('chai'); let chaiHttp = require('chai-http');
let server   = require('../server');
let should   = chai.should();

chai.use(chaiHttp);

describe('Database', () => {
   beforeEach(function(done){
     chai.request(dbURL).del('/')
     chai.request(dbURL)
      .put('/')
      .end((err, resp) => {
        done();
      });
   });

   describe('GET ' + dbURL, () => {
    it('it should get an existing test database', (done) => {
      chai.request(dbURL)
        .get('/')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.db_name.should.be.eql('api_test');
          done();
        });
    });
  });
});

describe('Object', () => {
  before(function(done){
    chai.request(dbURL).put('/');

    let views   = require('../config/views');

    chai.request(dbURL)
      .put('/' + views.index_name)
      .send({ language: 'query', views: views.index_view })
      .end((err, resp) => {
        done();
      });
  });

  after(function(done){
    chai.request(dbURL).del('/')
      .end((err, resp) => {
        done();
      });
  });

  describe('POST /object', () => {
    it('should save a valid object', (done) => {
      let object = { mykey: 'myvalue' }
      
      chai.request(server)
        .post('/object')
        .send(object)
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.should.be.a('object');
          resp.body.should.have.all.keys(['key', 'value', 'timestamp']);
          done();
        });
    });

    it('should not save an invalid object', (done) => {
      let object = {"":""}

      chai.request(server)
        .post('/object')
        .send(object)
        .end((err, resp) => {
          resp.should.have.status(400);
          done();
        });
    });

    it('should not save with an empty object', (done) => {
      chai.request(server)
        .post('/object')
        .send('')
        .end((err, resp) => {
          resp.should.have.status(400);
          done();
        });
    });
  });

  describe('GET /object/:key', () => {
    before(function(done){
      let object1 = { key: 'mykey1', value: 'myvalue1', timestamp: '2017-01-01 06:00:00' }
      let object2 = { key: 'mykey1', value: 'myvalue2', timestamp: '2017-01-01 06:05:00' }
      
      chai.request(dbURL)
        .post('/')
        .send(object1)
        .end((err, resp) => {

        });

      chai.request(dbURL)
        .post('/')
        .send(object2)
        .end((err, resp) => {
          done();
        });
    });

    it('should get an empty value', (done) => {
      chai.request(server)
        .get('/object/key')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.should.be.eql({});
          done();
        });
    });

    it('should get myvalue', (done) => {
      chai.request(server)
        .get('/object/mykey')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.should.be.eql({'value':'myvalue'});
          done();
        });
    });

    it('should get myvalue2 without timestamp', (done) => {
      chai.request(server)
        .get('/object/mykey1')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.should.have.key('value');
          resp.body.should.be.eql({'value':'myvalue2'});
          done();
        });
    });

    it('should get myvalue1 with timestamp', (done) => {
      chai.request(server)
        .get('/object/mykey1?timestamp=1483250580')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.should.have.key('value');
          resp.body.should.be.eql({'value':'myvalue1'});
          done();
        });
    });
  });
});

