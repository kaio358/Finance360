const mysql = require("mysql");

class Tabelas {
    init(conexao) {
        this.conexao = conexao;
        this.criarUsuario();
        this.criarDividendos();
        this.criarInvestimento();
        this.criarStockHistoria();
        this.criarStock();
        this.criarIndex();
    }

    criarUsuario() {
        const sql = `CREATE TABLE IF NOT EXISTS users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        email VARCHAR(255) NOT NULL UNIQUE,
                        password VARCHAR(255) NOT NULL
                    );`;
        this.conexao.query(sql, erro => {
            if (erro) {
                console.log("Erro ao criar a tabela 'users':", erro);
            } else {
                console.log("Tabela 'users' criada com sucesso!");
            }
        });
    }

    criarDividendos() {
        const sql = `CREATE TABLE IF NOT EXISTS dividends (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        empresa VARCHAR(255) NOT NULL,
                        data DATE NOT NULL,
                        valor DECIMAL(10, 2) NOT NULL
                    );`;
        this.conexao.query(sql, erro => {
            if (erro) {
                console.log("Erro ao criar a tabela 'dividends':", erro);
            } else {
                console.log("Tabela 'dividends' criada com sucesso!");
            }
        });
    }

    criarInvestimento() {
        const sql = `CREATE TABLE IF NOT EXISTS investments (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        ticker VARCHAR(20) NOT NULL,
                        value DECIMAL(10, 2) NOT NULL,
                        quantity INT NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id)
                    );`;
        this.conexao.query(sql, erro => {
            if (erro) {
                console.log("Erro ao criar a tabela 'investments':", erro);
            } else {
                console.log("Tabela 'investments' criada com sucesso!");
            }
        });
    }

    criarStockHistoria() {
        const sql = `CREATE TABLE IF NOT EXISTS stock_history (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        ticker VARCHAR(20) NOT NULL,
                        date DATE NOT NULL,
                        open_price DECIMAL(10, 2) NOT NULL,
                        close_price DECIMAL(10, 2) NOT NULL,
                        high_price DECIMAL(10, 2) NOT NULL,
                        low_price DECIMAL(10, 2) NOT NULL,
                        volume BIGINT NOT NULL,
                        long_name VARCHAR(255),
                        change_percent DECIMAL(5, 2),
                        earnings_per_share DECIMAL(10, 2)
                    );`;
        this.conexao.query(sql, erro => {
            if (erro) {
                console.log("Erro ao criar a tabela 'stock_history':", erro);
            } else {
                console.log("Tabela 'stock_history' criada com sucesso!");
            }
        });
    }

    criarStock() {
        const sql = `CREATE TABLE IF NOT EXISTS stocks (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        ticker VARCHAR(20) NOT NULL
                    );`;
        this.conexao.query(sql, erro => {
            if (erro) {
                console.log("Erro ao criar a tabela 'stocks':", erro);
            } else {
                console.log("Tabela 'stocks' criada com sucesso!");
            }
        });
    }

    criarIndex() {
        const verificarIndexExistente = (indexName, tableName, callback) => {
            const checkSql = `SELECT COUNT(*) AS count FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = '${tableName}' AND index_name = '${indexName}';`;
            this.conexao.query(checkSql, (err, results) => {
                if (err) {
                    return callback(err);
                }
                const indexExists = results[0].count > 0;
                callback(null, indexExists);
            });
        };

        const criarIndex = (indexName, sql) => {
            verificarIndexExistente(indexName, sql.split(' ON ')[1].split(' (')[0], (err, indexExists) => {
                if (err) {
                    console.error(`Erro ao verificar a existência do índice '${indexName}':`, err);
                } else if (!indexExists) {
                    this.conexao.query(sql, erro => {
                        if (erro) {
                            console.error(`Erro ao criar o índice '${indexName}':`, erro);
                        } else {
                            console.log(`Índice '${indexName}' criado com sucesso!`);
                        }
                    });
                } else {
                    console.log(`Índice '${indexName}' já existe, não é necessário criá-lo.`);
                }
            });
        };

        criarIndex('idx_stock_history_ticker', 'CREATE INDEX idx_stock_history_ticker ON stock_history (ticker);');
        criarIndex('idx_stocks_ticker', 'CREATE INDEX idx_stocks_ticker ON stocks (ticker);');
    }
}

module.exports = new Tabelas();
