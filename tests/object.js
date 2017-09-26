var env   = process.env.NODE_ENV || 'test';

let db    = require('../config/database')[env];
let dbURL = "http://" + db.host + ":" + db.port + "/" + db.name; 

let chai     = require('chai');
let chaiHttp = require('chai-http');
let server   = require('../server');
let request  = require('request');
let should   = chai.should();

chai.use(chaiHttp);

describe('Object', () => {
  beforeEach((done) => {
    request.del(dbURL);
    request.post(dbURL);  
    done();
  });

  describe('/POST object', () => {
    it('it should POST an object', (done) => {
      let object = {
        mykey: 'myvalue'
      }
      
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
  });

  describe('/GET object', () => {
    before((done) => {
      let object1 = { mykey1: 'myvalue1' }

      request.post({
        url: dbURL,
        body: object1,
        json: true
      }); 
      done();
    }); 

    it('should GET an object', (done) => {
      chai.request(server)
        .get('/object/mykey1')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.should.have.key('value');
          done();
        });
    });
  });
});

