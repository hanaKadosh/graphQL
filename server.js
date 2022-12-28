const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')

const app = express();

const schema = buildSchema(`
    type Query {
        hello:string
    }
`)

const root = {
    hello: () => {
        return "hello world!";
    },
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