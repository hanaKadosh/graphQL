const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
var sql = require("mssql/msnodesqlv8");
const axios = require("axios");

const app = express();

const schema = buildSchema(`

    type Post {
        userId: Int
        id: Int
        title: String
        body: String
    }
    
    type User {
        name: String
        age: Int
        college: String
    }

    type Query {
        hello: String!
        welcomeMessage(name: String, dayOfWeek: String!): String
        getUser: User
        getUsers: [User]
        getPostsFromExternalAPI: [Post]
    }

`);

var data = "";

var config = {
  connectionString:
    "Driver=SQL Server;Server=OR-PC\\SQLEXPRESS02;Database=Users;Trusted_Connection=true;",
};
sql.connect(config, (err) => {
  new sql.Request().query("SELECT * from Users", (err, result) => {
    console.log(".:The Good Place:.");
    if (err) {
      // SQL error, but connection OK.
      console.log("  Shirtballs: " + err);
    } else {
      // All is rosey in your garden.
      data = result;
      console.log(data.recordset);
    }
  });
});
sql.on("error", (err) => {
  // Connection borked.
  console.log(".:The Bad Place:.");
  console.log("  Fork: " + err);
});

var root = {
  hello: () => {
    return "Hello World";
  },
  welcomeMessage: (args) => {
    return `Hey ${args.name}, today is ${args.dayOfWeek}`;
  },
  getUser: () => {
    const user = {
      name: "Ros Bros",
      age: 25,
      college: "Rafik",
    };
    return user;
  },
  getUsers: () => {
    return data.recordset;
  },
  getPostsFromExternalAPI: () => {
    return axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((result) => result.data);
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root,
  })
);

app.listen(4000, () => console.log("Server on port 4000"));