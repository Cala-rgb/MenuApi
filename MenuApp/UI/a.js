const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.URI_2;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function getMenu(name) {
    let result = null;
    try {
      await client.connect();

      const database = client.db('MenuApp');
      const menus = database.collection('Menus');

      result = await menus.findOne({
        name: name
      });

    } finally {
      await client.close();
    }
    return result;
}

app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'))

app.set('view engine', 'pug')

app.get('/test/:name', (req, res) => {
    
    getMenu(req.params.name).then((result) => {
        console.log(result);
        res.render('index', result);
    });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});