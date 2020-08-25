const fs = require('fs')
const date = require('../data.json')
const { parse } = require('path')
const { age, graduation, birth } = require('../utils')

exports.index = function (req, res) {
    return res.render('students/index', { students: date.students })
}

//create
exports.create = function(req, res) {
    return res.render('students/create')
}

//post
exports.post = function (req, res) {

    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("Preencha todos os dados")
        }
    }

    let id = 1

    let birth = Date.parse(req.body.birth)
    const create_at = Date.now()

    const lastStudent = date.students[date.students.length -1]

    if(lastStudent) {
        id = Number(lastStudent.id + 1)
    }

    date.students.push({
        id,
        ...req.body,
        birth,
        create_at
    })

    fs.writeFile("data.json", JSON.stringify(date, null, 2), function (err) {
        if (err) {
            return res.send("writefile Error!")
        }

        return res.redirect('/students')
    })
}

//show
exports.show = function (req, res) {
    const { id } = req.params

    const foundStudents = date.students.find(function (student) {
        return student.id == id
    })

    if (!foundStudents) {
        return res.send("student not found")
    }

    const student = {
        ...foundStudents,
        age: age(foundStudents.birth),
        birth: birth(foundStudents.birth).birthDay,
        education_level: graduation(foundStudents.education_level),
        create_at: new Intl.DateTimeFormat("pt-BR").format(foundStudents.create_at)
    }

    return res.render('students/show', { student: student })
}

//edit
exports.edit = function (req, res) {
    const { id } = req.params
    const founsdStudents = date.students.find(function (student) {
        return student.id == id
    })

    if (!founsdStudents) {
        return res.send("student not found")
    }

    const student = {
        ...founsdStudents,
        birth: birth(founsdStudents.birth).iso
    }

    return res.render('students/edit', { student: student })
}

//put
exports.put = function (req, res) {
    const { id } = req.body

    let index = 0

    const studentFound = date.students.find(function (student, foundIndex) {
        if (id == student.id) {
            index = foundIndex
            return true
        }
    })

    if (!studentFound) {
        return res.send("student not found")
    }

    const student = {
        ...studentFound,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    date.students[index] = student

    fs.writeFile("data.json", JSON.stringify(date, null, 2), function (err) {
        if (err) return res.send("Writefile Error!")

        return res.redirect(`/students/${id}`)
    })
}

//DELETE
exports.delete = function (req, res) {
    const { id } = req.body

    const filteredStudents = date.students.filter(function (student) {
        if (student.id != id) {
            return true
        }
    })

    date.students = filteredStudents

    fs.writeFile("data.json", JSON.stringify(date, null, 2), function (err) {
        if (err) return res.send("WriteFile Error!")

        return res.redirect("/students")
    })
}