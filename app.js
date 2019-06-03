const express = require('express');
const app = express();

var graphqlHTTP = require("express-graphql");
var { buildSchema } = require("graphql");
var { getProducts, getProduct, addProduct, deleteProduct, updateProduct} = require("./data/products");

var cors = require("cors");

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'toto',
  password : '1234',
  database : 'tienda'
});

connection.connect(function(err) {
  if (!err)
    console.log("Connected!");
  else{
    console.log('Database error!  : '+ JSON.stringify(err, undefined,2));
    console.log(err);
  }
});
global.connection = connection;

//querys
var schema = buildSchema(`
  type Product {
    description: String,
    name: String,
    id:Int
  },
  type Query {
    hello: String,
    products: [Product],
    product(id: Int!): Product,
  },
  type Mutation {
    createProduct(name: String!, description: String!): Product,
    deleteProduct(id:Int!): [Product],
    updateProduct(id: Int!, name: String!, description: String!): [Product],
  },
`)//deleteProduct(id: Int!): Product //poner en modelo un método de eliminar

var root = { //métodos para llamar a los querys
  hello: () => {
    return "Hola mundo";
  },
  products: () => {
    return getProducts();
  },
  product: ({id}) => {
    return getProduct(id);
  },
  createProduct: args => {
    const { name, description } = args;
    return addProduct(name, description);
  },
  deleteProduct: ({id}) => {
    return deleteProduct(id);
  },
  updateProduct: args => {
    const { id, name, description } = args;
    return updateProduct(id, name, description);
  },
}

//cors
app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(4000);
console.log("Running a GraphQL API server at localhost:4000")