const express = require('express');
const mysql = require('../utility/mysql');

const router = express.Router();

function getOperator(input) {
	var result = [];
	var operators = ['>=', '<=', '>', '<', '='];

	for (const operator of operators) {
		if (input.indexOf(operator) == 0) {
			result = [operator, input.substring(operator.length)];
			break;
		}
	}

	if (result.length == 0)
		result = ['=', input];

	return result;
}

function extractQueryFilters(input, allowedFilters) {
	var result = {};

	for (const element of Object.keys(input)) {
		if (allowedFilters && !allowedFilters.includes(element))
			continue;

		result[element] = [];

		var filters = input[element];
		if (Array.isArray(filters)) {
			for (const filter of filters) {
				result[element].push(getOperator(filter));
			}
		}
		else {
			result[element].push(getOperator(filters));
		}
	}

	return result;
}

router.all('/casos', async (req, res) => {
	var query = req.query;
	var queryFilters = extractQueryFilters(query, ['sexo', 'idade', 'data_notificacao', 'estado', 'municipio', 'cep', 'internacao', 'evolucao', 'uti']);
	var queryKeys = Object.keys(queryFilters);
	var dbQuery = 'SELECT * FROM casos';

	var values = [];

	if (queryKeys.length > 0) {
		dbQuery += ' WHERE ';

		var idx = 0;
		for (const key of queryKeys) {
			for (const filter of queryFilters[key]) {
				if (idx++ > 0)
					dbQuery += " AND ";

				dbQuery += key + " " + filter[0] + " ?";
				values.push(filter[1]);
			}
		}
	}

	mysql.query(dbQuery, values, function (err, result) {
		if (err) console.log(err);
		res.send(result);
	});

	return;
});

router.all('/produtos', async (req, res) => {
	var query = req.query;
	var queryFilters = extractQueryFilters(query, ['loja', 'nome', 'status', 'preco', 'categoria']);
	var queryKeys = Object.keys(queryFilters);
	var dbQuery = 'SELECT * FROM produtos';

	var values = [];

	if (queryKeys.length > 0) {
		dbQuery += ' WHERE ';

		var idx = 0;
		for (const key of queryKeys) {
			for (const filter of queryFilters[key]) {
				if (idx++ > 0)
					dbQuery += " AND ";

				dbQuery += key + " " + filter[0] + " ?";
				values.push(filter[1]);
			}
		}
	}

	mysql.query(dbQuery, values, function (err, result) {
		if (err) console.log(err);
		res.send(result);
	});

	return;
});


router.all(`/`, async (req, res) => {

	const endpoints = {
		endpoints: [
			'/casos',
			'/produtos'
		]
	};

	res.send(endpoints);
});

module.exports = router;
