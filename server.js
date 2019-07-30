const express = require('express');
const Sequelize = require('sequelize');

const config = require('./config.json');
const app = express();
const sequelize = new Sequelize(config.database.driver);

const models = require('./models');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Models = {};
const associations = [];
for (let model of models) {
	const candidate = { name, belongs } = model;
	Models[name] = sequelize.define(name, model.schema);
	if (belongs) associations.push(candidate);
}
for (let candidate of associations) {
	candidate.belongs.forEach(reference => {
		Models[candidate.name].belongsTo(Models[reference]);
		Models[reference].hasMany(Models[candidate.name]);
	});
}

sequelize.sync()
	.then(() => {
		console.log("All Models Synced!!!");
	});
	
app.use(express.json());

app.route('/api/:model')
	.get((req, res, next) => {
		const { model } = req.params;
		Models[model].findAll().then( docs => {
			res.json(docs);
		})
	})
	.post((req, res, next) => {
		const { model } = req.params;
		req.body.birthday = new Date(req.body.birthday);

		Models[model].create(req.body).then( doc => {
			res.json(doc);
		})
	});

app.route('/api/:model/:id')
	.get((req, res, next) => {
		const { id, model } = req.params;
		Models[model].findAll({
			where: {
				id
			}
		}).then(docs => {
			res.json(docs[0]);
		})
	})
	.put((req, res, next) => {
		const { id, model } = req.params;
		Models[model].update(req.body, {
			where: {
				id
			}
		})
		.then(doc => {
			res.json(doc);
		})
	})
	.delete((req, res, next) => {
		const { id, model } = req.params;
		Models[model].destroy({
			where: {
				id
			}
		}).then(doc => {
			res.json(doc);
		})
	})

app.route('/api/user/:id/order')
	.post((req, res, next) => {
		Models['user'].findAll({
			where: {
				id: req.params.id
			}
		})
		.then(users => {
			Models['order'].create(req.body)
				.then(order => {
					users[0].addOrder(order)
						.then(() => {
							res.json(`You ordered an product!!!`)
						})
				})
		})
	})
	.get((req, res, next) => {
		Models['user'].findAll({
			where: {
				id: req.params.id
			}
		})
		.then(users => {
			users[0].getOrders()
				.then(orders => {
					res.json(orders)
				})
		})
	})

app.use((err, req, res, next) => {
	res.json({error: err.message});
})

app.listen(4000, () => {
	console.log("Running a API server using Sequelize at localhost:4000");
});
