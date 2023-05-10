// Importing required modules
let server = require("../server");
let chai = require("chai");
let chaiHttp = require("chai-http");

// Setup chai should assertion style and chai-http middleware
chai.should();
chai.use(chaiHttp);

// Main describe block for User API
describe("User API", () => {
  // Test GET all users endpoint
  describe("GET /users/all", () => {
    // Test to check if all users are returned
    it("It should GET all the users", (done) => {
      chai
        .request(server)
        .get("/users/all")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          done();
        });
    });

    // Test to check failure case of getting all users
    it("It should NOT GET all the users", (done) => {
      chai
        .request(server)
        .get("/user/all") // Incorrect path used to trigger failure
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });
  // Create a variable for storing the user ID for further tests
  let userID;
  // Test POST new user endpoint
  describe("POST /users", () => {
    // Before each test in this block, add a new user
    beforeEach((done) => {
      const user = {
        email: "chaiTesting",
        password: "chaiTesting",
        firstName: "chaiTesting",
        lastName: "chaiTesting",
        nationality: "chaiTesting",
      };
      chai
        .request(server)
        .post("/users")
        .send(user)
        .end((err, response) => {
          if (err) return done(err);
          response.should.have.status(200);
          userID = response.body.userID; // Save the user ID for further tests
          response.body.userID.should.be.a("number");
          done();
        });
    });

    // Test to check failure case of adding a new user
    it("It should NOT POST a new user", (done) => {
      const user = {
        email: "chaiTesting",
        password: "chaiTesting",
        firstName: "chaiTesting",
        lastName: "chaiTesting",
        nationality: "chaiTesting",
      };
      chai
        .request(server)
        .post("/users")
        .send(user) // This user already exists, so it should fail
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a("object");
          done();
        });
    });
  });

  // Create a variable for storing the email for further tests
  let email = "chaiTesting";

  // Test GET a user with email parameter
  describe("GET /users/s/:email", () => {
    // Test to check if a user is returned by email
    it("It should GET a user by userID", (done) => {
      chai
        .request(server)
        .get(`/users/s/${email}`)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          done();
        });
    });
    // Test to check failure case of getting a user by ID
    it("It should NOT GET a user by userID", (done) => {
      chai
        .request(server)
        .get("/users/" + 0)
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });
  // Test update a user by an PUT request with userID as parameter
  describe("PUT /users/s/:userID", () => {
    // Test to check if a user is updated by userid
    it("It should PUT a user by userID", (done) => {
      const user = {
        password: "chaiTestinPUT",
        firstName: "chaiTestingPUT",
        lastName: "chaiTestingPUT",
        nationality: "chaiTestingPUT",
      };
      chai.request(server)
        .put(`/users/s/${userID}`)
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          done();
        })
    })
    // Test to check failure case of updating a user by ID
    it("It should NOT PUT a user by userID", (done) => {
      const user = {
        password: "chaiTestinPUT",
        firstName: "chaiTestingPUT",
        lastName: "chaiTestingPUT"
      };
      chai.request(server)
        .put(`/users/s/${0}`)
        .send(user)
        .end((err, response) => {
          response.should.have.status(500);
          done();
        })
    })
  })


  // Test DELETE a user with userID as parameter
  describe("DELETE /users/s/:userID", () => {
    // Test to check if a user is deleted by userid
    it("It should DELETE a user by userID", (done) => {
      chai.request(server)
        .delete(`/users/s/${userID}`)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          done();
        });
    });

    // Test to check failure case of deleting a user by ID
    it("It should NOT DELETE a user by userID", (done) => {
      chai
        .request(server)
        .delete("/users/" + 0)
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });
});