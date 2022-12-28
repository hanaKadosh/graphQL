const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')

const app = express();

app.listen(3000, () => console.log('server on port 4000'))