const conexao = require("../infraestrutura/conexao");

class Stocks {
    procurarStocks(params) {
        const sql = `
            SELECT ticker, name
            FROM stocks
            WHERE ticker LIKE ? OR name LIKE ?
            LIMIT 10
        `;
        return new Promise((resolve, reject) => {
            conexao.query(sql, params, (erro, resultado) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultado);
                }
            });
        });
    }
}

module.exports= new Stocks;
