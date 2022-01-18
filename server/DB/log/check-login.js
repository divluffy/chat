const getUser = require('./user')

const checkLogin = async (username, password) => {
    let checkingDataRow = await getUser(username)
    if (checkingDataRow === undefined) return 'user undefined not found'

    if (checkingDataRow.username && checkingDataRow.password === password) {
        let { fullname, avatar, username, email, } = checkingDataRow
        return { toLogin: true, avatar, fullname, username, email, }
    } else return { toLogin: false }

}

module.exports = checkLogin