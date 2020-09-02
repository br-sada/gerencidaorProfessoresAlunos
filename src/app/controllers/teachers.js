const { parse } = require('path')
const { age, graduation, birth } = require('../../lib/utils')
const Teacher = require('../models/Teacher')

exports.index = function (req, res) {
    const { filter } = req.query

    if(!filter) {
        Teacher.all(function(teachers) {
            return res.render('teachers/index', { teachers })
        })
    } else {
        Teacher.findby(filter, function(teachers) {
            return res.render('teachers/index', { teachers })
        })
    }
}

//create
exports.create = function(req, res) {
    return res.render('teachers/create')
}

//post
exports.post = function (req, res) {

    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("Preencha todos os dados")
        }
    }

    Teacher.create(req.body, function(teacher) {
        return res.redirect(`/teachers/${ teacher.id }`)
    })
}

//show
exports.show = function (req, res) {
    Teacher.find(req.params.id, function(teacher) {
        if(!teacher) return res.send('Teacher not found!')
        
        teacher.age = age(teacher.birth)
        teacher.birthday = birth(teacher.birth).birthDay
        teacher.services = teacher.services.split(",")
        teacher.create_at = birth(teacher.create_at).format

        return res.render('teachers/show', { teacher })
    })

    
}

//edit
exports.edit = function (req, res) {
    Teacher.find(req.params.id, function(teacher) {
        if(!teacher) return res.send('Teacher not found!')

        teacher.birth = birth(teacher.birth).iso

        return res.render('teachers/edit', { teacher })
    })
}

//put
exports.put = function (req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("Preencha todos os dados")
        }
    }

    Teacher.update(req.body, function() {      
        return res.redirect(`teachers/${ req.body.id }`)
    })
       
}

//DELETE
exports.delete = function (req, res) {
    Teacher.delete(req.body.id, function() {
        return res.redirect("/teachers")
    })
}