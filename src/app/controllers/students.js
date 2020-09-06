const { parse } = require('path')
const { age, graduation, birth } = require('../../lib/utils')
const Student = require('../models/Student')

exports.index = function (req, res) {
    const { filter } = req.query

    if(!filter){
        Student.all(function(students) {
            return res.render('students/index', { students })
        })
    } else {
        Student.findby(filter, function(students) {
            return res.render('students/index', { students })
        })
    }
}

//create
exports.create = function(req, res) {

    Student.teacherSelectOption(function(option) {
        return res.render('students/create', { teacherOption: option })
    }) 
}

//post
exports.post = function (req, res) {

    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("Preencha todos os dados")
        }
    }
    
    Student.create(req.body, function(student) {
        return res.redirect(`/students/${ student.id }`)
    })
}

//show
exports.show = function (req, res) {
    Student.find(req.params.id, function(student) {
        if (!student) return res.send("student not found")

        student.age = age(student.birth)
        student.birthday = birth(student.birth).birthDay
        student.level = graduation(student.education_level)
        student.create_at = birth(student.create_at).format

        return res.render('students/show', { student })
    })

    
}

//edit
exports.edit = function (req, res) {
    Student.find(req.params.id, function(student) {
        if(!student) return res.send("Student Not Found")

        student.birth = birth(student.birth).iso

        Student.teacherSelectOption(function(option) {
            return res.render('students/edit', { student, teacherOption: option })
        }) 
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

    Student.update(req.body, function() {
        return res.redirect(`/students/${ req.body.id }`)
    })
}

//DELETE
exports.delete = function (req, res) {
    Student.delete(req.body.id, function() {
        return res.redirect('students/')
    })
}