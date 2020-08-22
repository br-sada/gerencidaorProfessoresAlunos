const fs = require('fs')
const date = require('./data.json')
const { parse } = require('path')
const { age, graduation, birth } = require('./utils')

exports.index = function (req, res) {
    return res.render('teachers/index', { teachers: date.teachers })
}

//create
exports.post = function (req, res) {

    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("Preencha todos os dados")
        }
    }

    let { avatar_url, name, birth, education_level, class_type, services } = req.body

    birth = Date.parse(birth)
    const create_at = Date.now()
    const id = Number(date.teachers.length + 1)


    date.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        education_level,
        class_type,
        services,
        create_at
    })

    fs.writeFile("data.json", JSON.stringify(date, null, 2), function (err) {
        if (err) {
            return res.send("writefile Error!")
        }

        return res.redirect('/teachers')
    })
}

//show
exports.show = function (req, res) {
    const { id } = req.params

    const foundTeachers = date.teachers.find(function (teacher) {
        return teacher.id == id
    })

    if (!foundTeachers) {
        return res.send("Teacher not found")
    }

    const teacher = {
        ...foundTeachers,
        age: age(foundTeachers.birth),
        education_level: graduation(foundTeachers.education_level),
        services: foundTeachers.services.split(","),
        create_at: new Intl.DateTimeFormat("pt-BR").format(foundTeachers.create_at)
    }

    return res.render('teachers/show', { teacher: teacher })
}

//edit
exports.edit = function (req, res) {
    const { id } = req.params
    const foundTeachers = date.teachers.find(function (teacher) {
        return teacher.id == id
    })

    if (!foundTeachers) {
        return res.send("Teacher not found")
    }

    const teacher = {
        ...foundTeachers,
        birth: birth(foundTeachers.birth)
    }

    return res.render('teachers/edit', { teacher: teacher })
}

//put
exports.put = function (req, res) {
    const { id } = req.body

    let index = 0

    const teacherFound = date.teachers.find(function (teacher, foundIndex) {
        if (id == teacher.id) {
            index = foundIndex
            return true
        }
    })

    if (!teacherFound) {
        return res.send("Teacher not found")
    }

    const teacher = {
        ...teacherFound,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    date.teachers[index] = teacher

    fs.writeFile("data.json", JSON.stringify(date, null, 2), function (err) {
        if (err) return res.send("Writefile Error!")

        return res.redirect(`/teachers/${id}`)
    })
}

//DELETE
exports.delete = function (req, res) {
    const { id } = req.body

    const filteredTeachers = date.teachers.filter(function (teacher) {
        if (teacher.id != id) {
            return true
        }
    })

    date.teachers = filteredTeachers

    fs.writeFile("data.json", JSON.stringify(date, null, 2), function (err) {
        if (err) return res.send("WriteFile Error!")

        return res.redirect("/teachers")
    })
}