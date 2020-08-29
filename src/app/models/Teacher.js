const { age, graduation, birth } = require('../../lib/utils')
const db = require('../../config/db')


module.exports = {
    //Listar todos os professores
    all(callback) {
        db.query(`SELECT * FROM teachers`, function(err, results) {
            if(err) throw `DataBase Error! ${err}`

            callback(results.rows)
        })
    },
    //criar cadastro
    create(data, callback) {
        const query = `
            INSERT INTO teachers (
                avatar_url,
                name,
                birth,
                email,
                education_level,
                class_type,
                services,
                create_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `
        const values = [
            data.avatar_url,
            data.name,
            birth(data.birth).iso,
            data.email,
            graduation(data.education_level),
            data.class_type,
            data.services,
            birth(Date.now()).iso
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `DataBase Error ${err}`

            callback(results.rows[0])
        })
    },
    //Buscar cadastro no DB
    find(id, callback) {
        db.query(`
            SELECT * FROM teachers WHERE id = $1`, [id], function(err, results) {
                if(err) throw `DataBase Error ${ err }`

                callback(results.rows[0])
            }
        )
    },
    //Editar Cadastro no DB
    update(data, callback) {
        const query = `
            UPDATE teachers SET 
                avatar_url = ($1),
                name = ($2),
                birth = ($3),
                email = ($4),
                education_level = ($5),
                class_type = ($6),
                services = ($7)
            WHERE id = $8
        `
        const values = [
            data.avatar_url,
            data.name,
            birth(data.birth).iso,
            data.email,
            graduation(data.education_level),
            data.class_type,
            data.services,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `DataBase Erro! ${err}`

            callback()
        })
    },
    //DELETE Cadastro no DB
    delete(id, callback) {
        db.query(`DELETE FROM teachers WHERE id = $1`, [id], function(err, results) {
            if(err) throw `DataBase Erro ${err}`

            callback()
        })
    }
}