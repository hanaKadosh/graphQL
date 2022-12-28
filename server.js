const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')
const axios = require('axios')

const app = express();

let message = "this is a message";

const schema = buildSchema(`
    type Post {
        userId:Int
        id:Int
        title:String
        body:String
    }

    type User {
        name:String
        age:Int
        college:String
    }

    type Query {
        hello:String!
        welcomeMessage(name: String, dayOfweek: String!): String
        getUser:User
        getUsers:[User]
        getPostsFromExternalAPI:[Post]
        message:String
    }

    input UserInput {
        name:String!
        age:Int!
        college:String!
    }

    type Mutation {
        setMessage(newMessage:String):String
        createUser(user: UserInput): User
    }
`)

const root = {
    hello: () => {
        return "hello world!";
    },
    welcomeMessage: (args) => {
        console.log(args);
        return `Hello ${args.name}, hows life, today is ${args.dayOfweek}`;
    },
    getUser: () => {
        const user = {
            name: "ofir",
            age: "32",
            college: "ness",
        }

        return user;
    },
    getUsers: () => {
        const users = [{
            name: "ofir",
            age: "32",
            college: "ness",
        },
        {
            name: "dan",
            age: "30",
            college: "ruppin",
        }]

        return users;
    },
    getPostsFromExternalAPI: async () => {
        const result = await axios.get('https://jsonplaceholder.typicode.com/posts');
        return result.data;
    },
    setMessage: ({ newMessage }) => {
        message = newMessage;
        return message
    },
    message: () => message,
    createUser: (args) => {
        console.log(args)
        return args.user;
    }
}

app.use('/graphql',
    graphqlHTTP({
        graphiql: true,
        schema: schema,
        rootValue: root,
    })
);

app.listen(3000, () => console.log('server on port 3000'))

// http://localhost:3000/graphql