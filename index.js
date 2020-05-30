const express = require('express');
const app = express();
const api = require('./api/v1');
const crawler = require('./utility/crawler');


function runCrawler() {
	crawler.casosCovidMg();
	crawler.produtosAraujo();

	//
	// Executa a cada 12 horas
	//
	setTimeout(runCrawler, 60 * 60 * 12);
}


//runCrawler();

app.use('/api', api);

app.listen(process.env.npm_package_configs_webserver_port, () => {
	console.log(
		`API listen on [${process.env.npm_package_configs_webserver_port}]`
	);
});
