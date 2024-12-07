const conexao = require("../infraestrutura/conexao");

class User {
    registrar(email, password) {
        return new Promise((resolve, reject) => {
            conexao.beginTransaction(async (err) => {
                if (err) return reject(err);

                try {
                    const existingUsers = await this.executarQuery(
                        `SELECT * FROM users WHERE email = ?`,
                        [email]
                    );
                    if (existingUsers.length > 0) {
                        await this.rollbackTransaction();
                        return reject({ status: 400, message: 'E-mail já registrado.' });
                    }

                    await this.executarQuery(
                        `INSERT INTO users (email, password) VALUES (?, ?)`,
                        [email, password]
                    );

                    conexao.commit((commitErr) => {
                        if (commitErr) return reject(commitErr);
                        resolve({ status: 201, message: 'Usuário registrado com sucesso!' });
                    });
                } catch (error) {
                    await this.rollbackTransaction();
                    reject(error);
                }
            });
        });
    }

    login(email) {
        return new Promise((resolve, reject) => {
            conexao.query(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (erro, resultado) => {
                    if (erro) reject(erro);
                    else resolve(resultado[0]);
                }
            );
        });
    }

    executarQuery(sql, params) {
        return new Promise((resolve, reject) => {
            conexao.query(sql, params, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    rollbackTransaction() {
        return new Promise((resolve) => conexao.rollback(() => resolve()));
    }
}

module.exports= new User;
