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
            email,
            birth,
            education_level,
            class_type,
            teacher_id,
            create_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
        `

        const values = [
            data.avatar_url,
            data.name,
            data.email,
            birth(data.birth).iso,
            graduation(data.education_level),
            data.class_type,
            data.teacher,
            birth(Date.now()).iso
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `DataBase Error! ${err}`

            callback(results.rows[0])
        })
    },
    //Encontrar
    find(id, callback) {
        db.query(`
        SELECT students.*, teachers.name AS teacher_name
        FROM students
        LEFT JOIN teachers ON (students.teacher_id = teachers.id) 
        WHERE students.id = $1`, [id], function(err, results) {
            if(err) throw `DataBase Error!${err}`

            callback(results.rows[0])
        })
    },
    //Busca com filtro
    findby(filter, callback) {
        db.query(`
        SELECT *
        FROM students 
        WHERE students.name ILIKE '%${ filter }%'
        OR students.email ILIKE '%${ filter }%'
        `, function(err, results) {
            
            if(err) throw `DataBase Error! ${err}`

            callback(results.rows)
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
                class_type = ($6),
                teacher_id = ($7)
            WHERE id = $8
        `

        const values = [
            data.avatar_url,
            data.name,
            data.email,
            birth(data.birth).iso,
            graduation(data.education_level),
            data.class_type,
            data.teacher,
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
    },
    teacherSelectOption(callback) {
        db.query(`SELECT name, id FROM teachers`, function(err, results) {
            if(err) throw `DataBase Error ${err}`

            callback(results.rows)
        })
    },
    paginate(params, callback) {
        const { filter, limit, offset } = params
        
        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM students
            ) AS total`


        if(filter) {
            filterQuery = `
            WHERE students.name ILIKE '%${ filter }%'
            OR students.email ILIKE '%${ filter }%'
            `

            totalQuery = `(
                SELECT count(*) FROM students
                ${filterQuery}
                ) AS total`
        }

        query = `
        SELECT students.*, ${totalQuery}
        FROM students
        ${filterQuery}
        LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function(err, results) {
            if(err) throw `DataBAse ${err}`

            callback(results.rows)
        })
    }
}

