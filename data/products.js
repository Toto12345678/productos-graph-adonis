
const addProduct = (name, description) => {
  return new Promise( ( resolve, reject ) => {
    const toto = connection.query('INSERT INTO products (name, description) VALUES (?, ?)', [name, description], (err, rows) => {
      if (!err) {
        connection.query('SELECT LAST_INSERT_ID() as id', (err, id_op) => {
          if (!err) {
            resolve({'id':id_op[0].id, 'name': name, 'description': description})
          }
        });
      }
    });
  });
}

const getProducts = () => {
  return new Promise( ( resolve, reject ) => {
    connection.query('SELECT * FROM products', (err, rows) => {
      if (!err) {
        resolve(rows);
      }
    });
  });
}

const getProduct = (id) => {
  return new Promise( ( resolve, reject ) => {
    connection.query('SELECT * FROM products WHERE id = ?', [id], (err, rows) => {
      if (!err) {
        resolve(rows);
      }
    });
  });
}

const deleteProduct = (id) => {
  return new Promise( ( resolve, reject ) => {
    connection.query('DELETE FROM products WHERE id = ?', [id], (err, rows) => {
      if (!err) {
        resolve(getProduct(id));
      }
    });
  });
}

const updateProduct = (id, name, description) => {
  return new Promise( ( resolve, reject ) => {
    connection.query('UPDATE products SET name = ?, description = ? WHERE id = ?', [name, description, id], (err, rows) => {
      if (!err) {
        resolve(getProduct(id));
      }
    });
  });
}

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  deleteProduct,
  updateProduct
};