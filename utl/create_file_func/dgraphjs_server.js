function buildExpressServer(database) {
  let query = `
const dgraph = require('dgraph-js');
const grpc = require("grpc");
const clientStub = new dgraph.DgraphClientStub(
  // addr: optional, default: "localhost:9080"
  "localhost:9080",
  // credentials: optional, default: grpc.credentials.createInsecure()
  grpc.credentials.createInsecure(),
);

const dgraphClient = new dgraph.DgraphClient(clientStub);


require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql-schema');
const path = require('path');
const app = express();
`;

  if (database === 'MongoDB') {
    query += `
const mongoose = require('mongoose');
const MongoDB = process.env.MONGO_URI || 'mongodb://localhost/graphql';

mongoose.connect(MongoDB, { useNewUrlParser: true }, () => console.log('connected to database'));
`;
  }

  query += `
app.use(express.static(path.join(__dirname, './public')))

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: false //Set to true to view GraphiQl in browser at /graphql
}));

app.listen(4000, () => {
  console.log('Listening on 4000')
});
`;
  return query;
}

module.exports = buildExpressServer;
