/*
 * All routes for Widget Data are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /api/widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */



const pool = require('../../database/connection');

module.exports = {
  // This should verify if user is registered by returning true
  getUserWithEmail: (email) => {
    return pool.query(`SELECT * FROM users
    WHERE email = $1`, [`${email}`])
      .then((result) => {
        if (result) {
          if (result['rows'].length !== 0) {
            // Returns true if user email is in database
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }

      })
      .catch((err) => {
        console.log(err.message);
      });
  },

  getUserID: (email) => {

    return pool.query(`SELECT * FROM users
    WHERE email = $1`, [`${email}`])
      .then((result) => {
        if (result) {
          if (result['rows'].length !== 0) {
            // Returns true if user email is in database
            console.log(result['rows'][0].id);
            return result['rows'][0].id;
          } else {
            return null;
          }
        } else {
          return null;
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  },

  addUser: (user) => {

    const values = [user.firstName, user.lastName, user.email];

    let queryString = `INSERT INTO users
    (first_name, last_name, email)
    VALUES ($1, $2, $3)
    RETURNING* ;
    `;

    return pool.query(queryString, values)
      .then((result) => {
        return result.rows[0];
      })
      .catch((err) => {
        console.log(err.message);
      });
  },

  // This query should add an extra item to items table
  addItem: (item) => { //maybe return item as object ??? and maybe check if the user entered an empty object

    const values = [item.userid, item.name, item.category];

    let queryString = `INSERT INTO items
    (userid, name, category, is_active)
    VALUES ($1, $2, $3, TRUE)
    RETURNING* ;
    `;

    return pool.query(queryString, values)
      .then((result) => {
        return result.rows[0];
      })
      .catch((err) => {
        console.log(err.message);
      });
  },

  // Checks if item is in database and returns a boolean/true/false
  ifItemExists: (name, email) => {
    const values = [name, email];

    let queryString = `SELECT name
    FROM items
    JOIN users ON items.userid = users.id
    WHERE items.name =  $1 AND users.email = $2;
    `;

    return pool.query(queryString, values)
      .then((result) => {
        if(result.rows.length !== 0){
          return true;
        }
        return false;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // This query should logically change the status of an active
  // item to an inactive item
  removeItem: (itemName, email) => {

    const values = [itemName, email];

    let queryString = `UPDATE items
    SET is_active = FALSE
    FROM users WHERE items.userid = users.id
    AND items.name = $1  AND users.email = $2
    RETURNING* ;
    `;

    return pool.query(queryString, values)
      .then((result) => {
        return result.rows[0];
      })
      .catch((err) => {
        console.log(err.message);
      });

  },

  //  This should join the users and items table and grab all
  // items specific to user
  grabInitialList: (useremail) => {
    const values = [useremail];

    let queryString = `SELECT items.*
    FROM items
    JOIN users ON users.id = items.userid
    WHERE users.email = $1 AND is_active = TRUE;
    `;

    return pool.query(queryString, values)
      .then((result) => {
        //console.log(result);
        return result.rows;
      })
      .catch((err) => {
        console.log(err.message);
      });
  },


  categorizeItem: (item) => {
    const values = [item.name];

    let queryString = `SELECT category
    FROM data
    WHERE name = $1;
    `;

    return pool.query(queryString, values)
      .then((result) => {
        console.log('this category is:',result.rows[0].category);
        return result.rows[0].category;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }



}

// Commented out since we are no longer using router
// const express = require('express');
// Commented out since we are no longer using router
// const router  = express.Router();

//'/api/widgets'
// router.get('/', (req, res) => {
//   const query = `SELECT * FROM widgets`;
//   console.log(query);
//   pool.query(query)
//     .then(data => {
//       const widgets = data.rows;
//       res.json({ widgets });
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .json({ error: err.message });
//     });
// });

// Commented out since we are no longer using router
// module.exports = router;
