const url = "http://localhost:8080/api/user/"


const userInfo = document.querySelector("#current-user-info")
let usersTable = document.querySelector("#users-table")

const usersTableTemplate = {
    0: "ID",
    1: "Username",
    2: "Role",
}
const userFetch = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
    },
    getAuthUser: async () => await fetch(url),
}
window.onload = () => {
    updateCurrentUserInfo()
    showUserPanel()
}

async function updateCurrentUserInfo() {
    await getCurrentUser().then(user => {
        const username = document.createElement("b")
        const text = document.createTextNode(" with roles ")
        const roles = document.createElement("b")

        username.insertAdjacentText("afterbegin", user.username)
        roles.insertAdjacentText("beforeend", user.roles.map(role => " " + role.name))

        if (!userInfo.hasChildNodes()) {
            userInfo.appendChild(username)
            userInfo.appendChild(text)
            userInfo.appendChild(roles)
        } else {
            userInfo.firstChild.replaceWith(username)
            userInfo.lastChild.replaceWith(roles)
        }
    })
}

async function getCurrentUser() {
    console.log("Работает метод getCurrentUser")
    let response = await userFetch.getAuthUser()
    let user = await response.json()
    return user
}

function showUserPanel() {
    console.log("Работает метод showUserPanel")
    getCurrentUser().then(user => {
        usersTable = document.createElement("table")
        usersTable.setAttribute("class", "table table-striped table-hover")
        usersTable.setAttribute("id", "users-table")
        document.querySelector("#all-users-card-body").appendChild(usersTable)

        $("#user-panel-title").text("User information-page")
        $("#users-tab-name").text("About user")
        $("#user-nav-link").addClass("active").prop("aria-selected", true)


        let tblHead = usersTable.createTHead()
        let tblBody = usersTable.createTBody()
        let tblHeadRow = tblHead.insertRow()
        let tblBodyRow = tblBody.insertRow()

        for (let i = 0; i < 3; i++) {
            let th = document.createElement("th")
            let text = document.createTextNode(usersTableTemplate[i])
            th.appendChild(text)
            tblHeadRow.appendChild(th)
        }

        tblBodyRow.insertCell().appendChild(document.createTextNode(user.id))
        tblBodyRow.insertCell().appendChild(document.createTextNode(user.username))
        tblBodyRow.insertCell().appendChild(document.createTextNode(user.roles.map(role => role.name)))
    })
}

