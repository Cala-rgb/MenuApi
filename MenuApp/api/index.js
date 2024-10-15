
//TODO ADD SCHEMAS

const handler = require('./db_handler.js');

const express = require('express');
const bodyParser = require('body-parser');

app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { auth } = require('express-oauth2-jwt-bearer');

const jwtCheck = auth({
    audience: 'http://localhost:3000',
    issuerBaseURL: 'https://dev-m6gpcnrtxv3jbetk.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

app.use(jwtCheck);


app.get('/get/menus', (req, res, next) => {
	user_id = req.query.user_id;
	if (user_id == null || user_id == "") {
		const error = new Error('Invalid user id');
		error.status = 400;
		next(error);
	}
	else {
		handler.getMenus(user_id).catch(console.dir).then((result) => {
			//console.log(result);
			res.status(200).json(result);
		});
	}
});

app.post('/add/menu', (req, res, next) => {

	menu = req.body;

	console.log(menu);

	// No name
	if (menu.name == null || menu.name == "") {
		const error = new Error('Invalid menu: name is required');
    	error.status = 410;
    	next(error);
	}
	// No items
	else if (menu["items"] == null || menu["items"].length == 0) {
		const error = new Error('Invalid menu: items are required');
		error.status = 420;
		next(error);
	}
	//No userid
	else if (menu["userid"] == null || menu["userid"] == "") {
		const error = new Error('Invalid menu: userid is required');
		error.status = 430;
		next(error);
	}
	else {
		
		//No theme -> set default
		if (menu.theme == null || menu.theme == "") {
			menu.theme = "default";
		}

		var json = {
			"items": [
				{"name":"Crispy", "price":"30", "category":"Food"},
				{"name":"Pui", "price":"25", "category":"Food"},
				{"name":"Apa", "price":"7", "category":"Drinks"}
			] 
		};


		// Check items
		i = 0;
		var items = JSON.parse(menu["items"]);
		menu["items"] = items;
		for (item of items) {
			// No item name
			console.log(item);
			if (item.name == null || item.name == "") {
				const error = new Error('Invalid item: name is required');
				error.status = 440;
				next(error);
			}
			// No item price
			else if (item.price == null) {
				const error = new Error('Invalid item: price is required');
				error.status = 450;
				next(error);
			}
			//No item category
			else if (item.category == null) {
				const error = new Error('Invalid item: category is required');
				error.status = 460;
				next(error);
			}
		}

		menu.items_number = menu.items.length;

		//All good
		handler.addMenu(menu).catch(console.dir).then(() => {
			res.status(200).send("Menu added successfully");
		});
	}
});

app.put('/add/item', (req, res, next) => {

	menu_id = req.query.menu_id;

	item = req.body;

	if (menu_id == null || menu_id == "") {
		const error = new Error("Invalid menu id");
		error.status = 400;
		next(error);
	}
	else if (item.name == null || item.name == "") {
		const error = new Error('Invalid item: name is required');
		error.status = 400;
		next(error);
	}
	else if (item.price == null) {
		const error = new Error('Invalid item: price is required');
		error.status = 400;
		next(error);
	}
	else {
		handler.addMenuItem(menu_id, req.body).catch(console.dir).then(() => {
			res.status(201).send("Item added successfully");
		});
	}
});

//TODO: Need to think this better -> ce primesti ce faci
app.put('/update/item', (req, res, next) => {
	
	menu_id = req.query.menu_id;
	item_name = req.query.item_name;
	item = req.body;

	if (menu_id == null || menu_id == "") {
		const error = new Error("Invalid menu id");
		error.status = 400;
		next(error);
	}
	else if (item.price == null) {
		const error = new Error('Invalid item: price is required');
		error.status = 400;
		next(error);
	}
	else {
		handler.updateMenuItem(menu_id, item_name, req.body).catch(console.dir).then(() => {
			res.status(201).send("Item updated successfully");
		});
	}
});

//TODO
app.put('/update/menu', (req, res, next) => {
});

app.delete('/delete/menu', (req, res, next) => {
	menu_id = req.query.menuid;
	if (menu_id == null || menu_id == "") {
		const error = new Error("Invalid menu id");
		error.status = 400;
		next(error);
	}
	else {
		handler.deleteMenu(menu_id).catch(console.dir).then(() => {
			res.status(200).send("Menu deleted successfully");
		});
	}
});

app.delete('/delete/item', (req, res, next) => {
	
	menu_id = req.query.menu_id;
	item_name = req.query.item_name;

	if (menu_id == null || menu_id == "") {
		const error = new Error("Invalid menu id");
		error.status = 400;
		next(error);
	}
	else {
		handler.deleteMenuItem(menu_id, item_name, req.body).catch(console.dir).then(() => {
			res.status(200).send("Item deleted successfully");
		});
	}

});


app.use((err, req, res, next) => {
	res.status(err.status || 500).json({error: err.message});
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});