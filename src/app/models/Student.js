const { age, graduation, birth } = require('../../lib/utils')
const db = require('../../config/db')


module.exports = {
    //Listar Alunos
    all(callback) {
        db.query(`SELECT * FROM students`, function(err, results) {
            if(err) throw `DataBase Error! ${err}`

            callback(results.rows)
        })
    },
    //Criar Cadastro Estudante
    create(data, callback) {
        const query = `INSERT INTO students (
            avatar_url,
            name,
            birth,
            education_level,
            class_type,
            services,
            create_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
        `

        const values = [
            data.avatar_url,
            data.name,
            birth(data.birth).iso,
            graduation(data.education_level),
            data.class_type,
            data.services,
            birth(Date.now()).iso
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `DataBase Error! ${err}`

            callback(results.rows[0])
        })
    },
    //Encontrar
    find(id, callback) {
        db.query(`SELECT * FROM students WHERE id = $1`, [id], function(err, results) {
            if(err) throw `DataBase Error!${err}`

            callback(results.rows[0])
        })
    },
    //Atualizar Cadastro Estudantes
    update(data, callback) {
        const query = `
            UPDATE students SET 
                avatar_url = ($1),
                name = ($2),
                email = ($3),
                birth = ($4),
                education_level = ($5),
                class_type = ($6)
            WHERE id = $7
        `

        const values = [
            data.avatar_url,
            data.name,
            data.email,
            birth(data.birth).iso,
            graduation(data.education_level),
            data.class_type,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `DataBase Error!${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM students WHERE id = $1`, [id], function(err, results) {
            if(err) throw `DataBase Error! ${err}`

            callback()
        })
    }
}

