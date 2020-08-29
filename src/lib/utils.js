module.exports = {
    age: function(timestamp) {
        const today = new Date()
        const birthdate = new Date(timestamp)

        let age = today.getFullYear() - birthdate.getFullYear()

        const month = today.getMonth() - birthdate.getMonth()

        if (month < 0 || month == 0 && today.getDate() < birthdate.getDate()) {
            age = age - 1
        }

        return age
    },
    graduation: function(education_level) {
        if(education_level == "Medio") {
            return "Ensino Médio Completo"
        }

        if(education_level == "Superior") {
            return "Ensino Superior Completo"
        }

        return education_level
    },
    birth: function(timestamp) {
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()

        const mounth = `0${date.getUTCMonth() + 1}`.slice(-2)
        
        const day = `0${date.getUTCDate()}`.slice(-2)

        return {
            day,
            mounth,
            year,
            iso: `${year}-${mounth}-${day}`,
            birthDay: `${day}/${mounth}`,
            format: `${day}/${mounth}/${year}`
        }
    }
}