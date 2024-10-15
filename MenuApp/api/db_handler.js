const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId; 
const dotenv = require('dotenv').config();
const uri = process.env.URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


module.exports = {

  getMenus: async function(user_id) {
    let result = null;
    try {
      await client.connect();

      const database = client.db('MenuApp');
      const menus = database.collection('Menus');

      const cursor = menus.find({
        userid: user_id
      });

      result = await cursor.toArray();

    } finally {
      await client.close();
    }
    return result;
  },

  addMenu: async function(item) {
    try {
      await client.connect();

      const database = client.db('MenuApp');
      const menus = database.collection('Menus');

      await menus.insertOne(item)

    } finally {
      await client.close();
    }
  },

  addMenuItem: async function(menu_id, item) {
    try {
      await client.connect();

      const database = client.db('MenuApp');
      const menus = database.collection('Menus');

      let o_id = ObjectId.createFromHexString(menu_id);

      await menus.updateOne(
        { _id: o_id },
        { $push: { items: item },
          $inc: { items_number: 1 }
        }
      )

    } finally {
      await client.close();
    }
  },

  updateMenuItem: async function(menu_id, item_name, item) {
    try {
      await client.connect();

      const database = client.db('MenuApp');
      const menus = database.collection('Menus');

      let o_id = ObjectId.createFromHexString(menu_id);

      await menus.updateOne(
        { _id: o_id },
        { $set: {"items.$[i].price": item.price} },
        { arrayFilters: [ { "i.name": item_name } ] }
      )

    } finally {
      await client.close();
    }
  },

  deleteMenu: async function(menu_id) {
    try {
      await client.connect();

      const database = client.db('MenuApp');
      const menus = database.collection('Menus');

      let o_id = ObjectId.createFromHexString(menu_id);

      await menus.deleteOne(
        { _id: o_id }
      )

    } finally {
      await client.close();
    }
  },

  deleteMenuItem: async function(menu_id, item_name) {
    try {
      await client.connect();

      const database = client.db('MenuApp');
      const menus = database.collection('Menus');

      let o_id = ObjectId.createFromHexString(menu_id);

      await menus.updateOne(
        { _id: o_id },
        { $pull: { items: { name: item_name } },
          $inc: { items_number: -1 }
        }  
      )

    } finally {
      await client.close();
    }
  }
}