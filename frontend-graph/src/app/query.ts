'use strict';

import gql from 'graphql-tag';

//mutation to insert a product
export const createProduct = gql`
  mutation createProduct($name: String!, $description: String!) {
    createProduct(name: $name, description: $description){
      id,
      name,
      description
    }
  }`;

  //mutation to update a product
  export const updateProduct = gql`
    mutation updateProduct($id: Int!, $name: String!, $description: String!) {
      updateProduct(id: $id, name: $name, description: $description){
        id,
        name,
        description
      }
    }`;

  //mutation to delete a product
  export const deleteProduct = gql`
    mutation deleteProduct($id: Int!) {
      deleteProduct(id: $id){
        id,
        name
      }
    }`;

  //get all products
  export const Products = gql`
    query{
      products {
        id,
        name,
        description
      }
    }`;