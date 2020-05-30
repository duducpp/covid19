const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const csv = require('csv-parser')
const mysql = require('./mysql');
const fs = require('fs');

function casosCovidMg() {

    request('https://www.saude.mg.gov.br/coronavirus/painel', function (err, res, body) {
        if (err) console.log('Error: ' + err);

        var $ = cheerio.load(body);
        var csvBtn = $(`a:contains('Baixar dados CSV')`);

        if (csvBtn.length) {
            var csvUrl = csvBtn.attr('href');

            if (csvUrl) {

                request({ encoding: null, method: "GET", uri: csvUrl }, function (err, res, body) {
                    if (err) console.log('Error: ' + err);

                    var encodedBody = iconv.decode(new Buffer.from(body), "ISO-8859-1");

                    fs.writeFile('saude-mg.csv', encodedBody, function (err) {
                        if (err) console.log('Error: ' + err);

                        const results = [];
                        fs.createReadStream('saude-mg.csv')
                            .pipe(csv({ separator: ';' }))
                            .on('data', (data) => results.push(data))
                            .on('end', () => {
                                results.forEach(function (element, index) {
                                    var date = element['DATA_NOTIFICACAO'] == 'NA' ? '01/01/2000' : element['DATA_NOTIFICACAO'];
                                    var dateParts = date.split("/");
                                    var modifiedDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]).toISOString().slice(0, 19).replace('T', ' ');

                                    this[index] = [
                                        parseInt(element['ID']),
                                        modifiedDate,
                                        element['SEXO'] == 'Masculino' ? 1 : 2,
                                        parseInt(element['IDADE'] == 'NA' ? -1 : element['IDADE']),
                                        'MG',
                                        element['MUNICIPIO_RESIDENCIA'],
                                        parseInt(element['MUNICIPIO_RESIDENCIA_COD'] == 'NA' ? -1 : element['MUNICIPIO_RESIDENCIA_COD']),
                                        element['EVOLUCAO'] == 'OBITO' ? 3 : element['EVOLUCAO'] == 'RECUPERADO' ? 2 : element['EVOLUCAO'] == 'EM ACOMPANHAMENTO' ? 1 : 0,
                                        element['INTERNACAO'] == 'NÃO' ? 2 : element['INTERNACAO'] == 'SIM' ? 1 : 0,
                                        element['UTI'] == 'NÃO' ? 2 : element['UTI'] == 'SIM' ? 1 : 0,
                                    ];
                                }, results);

                                mysql.query('INSERT INTO casos (identificador, data_notificacao, sexo, idade, estado, municipio, cep, internacao, evolucao, uti) VALUES ? ON DUPLICATE KEY UPDATE data_atualizacao = CURRENT_TIMESTAMP', [results], function (err) {
                                    if (err) throw err;
                                    console.log('Casos atualizados');
                                });
                            });
                    });
                });
            }
        }
    });
}


function produtosAraujo() {
    // 
    // Álcool Gel
    //
    request('https://busca.araujo.com.br/busca?q=alcool+gel', function (err, res, body) {
        if (err) console.log('Error: ' + err);

        var $ = cheerio.load(body);

        const filterWords = ['Antisséptico', 'Higienizador', '70%'];

        var produtos = [];
        $('.vtex-cpSkuIds').each(function () {
            var store = 'Araujo';
            var category = 'Alcool';
            var name = $(this).attr('data-sku-name');
            var image = $(this).attr('data-sku-image');
            var status = $(this).attr('data-sku-status') == 'available' ? 1 : 0;
            var price = $(this).attr('data-sku-price').replace(',', '.');
            var url = $(this).attr('ref');

            var filtred = false;
            for (const filterWord of filterWords) {
                if (name.toLocaleLowerCase().indexOf(filterWord.toLocaleLowerCase()) != -1) {
                    filtred = true;
                    break;
                }
            }

            if (filtred)
                produtos.push(['Araujo', 'Mascara', name, image, status, price, url]);
        });

        mysql.query('INSERT INTO produtos (loja, categoria, nome, imagem, status, preco, url) VALUES ? ON DUPLICATE KEY UPDATE data_atualizacao = CURRENT_TIMESTAMP', [produtos], function (err) {
            if (err) throw err;
            console.log('Preços atualizados');
        });
    });

    // 
    // Mascaras
    //
    request('https://busca.araujo.com.br/busca?q=mascara', function (err, res, body) {
        if (err) console.log('Error: ' + err);

        var $ = cheerio.load(body);

        const filterWords = ['Tecido', 'Descartável', 'Hospitalar'];

        var produtos = [];
        $('.vtex-cpSkuIds').each(function () {
            var name = $(this).attr('data-sku-name');
            var image = $(this).attr('data-sku-image');
            var status = $(this).attr('data-sku-status') == 'available' ? 1 : 0;
            var price = $(this).attr('data-sku-price').replace(',', '.');
            var url = $(this).attr('ref');

            var filtred = false;
            for (const filterWord of filterWords) {
                if (name.toLocaleLowerCase().indexOf(filterWord.toLocaleLowerCase()) != -1) {
                    filtred = true;
                    break;
                }
            }

            if (filtred)
                produtos.push(['Araujo', 'Mascara', name, image, status, price, url]);
        });

        mysql.query('INSERT INTO produtos (loja, categoria, nome, imagem, status, preco, url) VALUES ? ON DUPLICATE KEY UPDATE data_atualizacao = CURRENT_TIMESTAMP', [produtos], function (err) {
            if (err) throw err;
            console.log('Preços atualizados');
        });
    });
}

module.exports = { casosCovidMg, produtosAraujo };