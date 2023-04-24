const url = "http://localhost:8080/api/admin/users/"

const userInfo = document.querySelector("#current-user-info")
let usersTable = document.querySelector("#users-table")
const addUserForm = document.addUserForm
const editUserForm = document.userEditForm

const usersTableTemplate = {
    0: "ID",
    1: "Username",
    2: "Role",
    3: "Edit",
    4: "Delete"
}

const userFetch = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
    },
    getUsersList: async () => await fetch(url),
    getUser: async (id) => await fetch(url + id),
    getAuthUser: async () => await fetch(url + "getAuth"),
    createUser: async (user) => await fetch(url, {method: "POST", headers: userFetch.head, body: JSON.stringify(user)}),
    updateUser: async (user) => await fetch(url, {method: "PUT", headers: userFetch.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(url + id, {method: "DELETE"})
}


window.onload = () => {
    updateCurrentUserInfo()
    showAdminPanel()
    document.getElementById("submit-edit-user-btn").addEventListener("click", editUser)
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
    console.log(user)
    return user
}

function showUserPanel() {
    console.log("Работает метод showUserPanel")
    getCurrentUser().then(user => {
        $("#users-table").remove()
        usersTable = document.createElement("table")
        usersTable.setAttribute("class", "table table-striped table-hover")
        usersTable.setAttribute("id", "users-table")
        document.querySelector("#all-users-card-body").appendChild(usersTable)

        $("#user-panel-title").text("User information-page")
        $("#admin-nav-tabs").addClass("collapse")
        $("#users-tab-name").text("About user")
        $("#admin-nav-link").removeClass("active").prop("aria-selected", false)
        $("#user-nav-link").addClass("active").prop("aria-selected", true)
        $("#new-user-panel").addClass("collapse")
        $("#admin-panel").removeClass("collapse")

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

async function showAdminPanel() {
    console.log("Работает метод showAdminPanel")

    $("#users-table").remove()
    usersTable = document.createElement("table")
    usersTable.setAttribute("class", "table table-striped table-hover")
    usersTable.setAttribute("id", "users-table")
    document.querySelector("#all-users-card-body").appendChild(usersTable)

    $("#user-panel-title").text("Admin panel")
    $("#admin-nav-tabs").removeClass("collapse")
    $("#users-tab-name").text("All users")
    $("#user-nav-link").removeClass("active").prop("aria-selected", false)
    $("#admin-nav-link").addClass("active").prop("aria-selected", true)
    $("#new-user-panel").addClass("collapse")
    $("#admin-panel").removeClass("collapse")
    $("#users-table-tab").addClass("active")
    $("#new-user-tab").removeClass("active")

    let tblHead = usersTable.createTHead()
    let tblBody = usersTable.createTBody()
    let tblHeadRow = tblHead.insertRow()

    // Filling table head
    for (let i = 0; i < 5; i++) {
        let th = document.createElement("th")
        let text = document.createTextNode(usersTableTemplate[i])
        th.appendChild(text)
        tblHeadRow.appendChild(th)
    }

    // Filling table body
    userFetch.getUsersList().then(res => {
        res.json().then(users => {
            users.forEach(user => {
                let editButton = document.createElement("button")
                editButton.setAttribute("type", "button")
                editButton.setAttribute("class", "btn btn-primary")
                editButton.textContent = "Edit"
                editButton.onclick = () => {
                    showEditUserForm(user.id)
                }


                let deleteButton = document.createElement("button")
                deleteButton.setAttribute("type", "button")
                deleteButton.setAttribute("class", "btn btn-danger")
                deleteButton.textContent = "Delete"
                deleteButton.onclick = () => {
                    showDeleteUserForm(user.id)
                }

                let tblBodyRow = tblBody.insertRow()
                tblBodyRow.insertCell().appendChild(document.createTextNode(user.id))
                tblBodyRow.insertCell().appendChild(document.createTextNode(user.username))
                tblBodyRow.insertCell().appendChild(document.createTextNode(user.roles.map(roles => " " + roles.name)))
                tblBodyRow.insertCell().appendChild(editButton)
                tblBodyRow.insertCell().appendChild(deleteButton)
            })
        })
    })
}

function showNewUserForm() {
    $("#new-user-panel").removeClass("collapse")
    $("#admin-panel").addClass("collapse")
}

function addNewUser() {
    console.log("Работает метод addNewUser")

    let user = {
        username: addUserForm.addUsername.value,
        password: addUserForm.addPassword.value,
        roles: []
    }

    Array.from(addUserForm.addRoles.options)
        .filter(option => option.selected)
        .map(option => option.value)
        .forEach(name => {
            let role = {
                id: 0,
                name: ""
            }
            if (name === "1") {
                role.id = 1
                role.name = "ADMIN"
            }
            if (name === "2") {
                role.id = 2
                role.name = "USER"
            }
            user.roles.push(role)
        })

    console.log(user)

    userFetch.createUser(user).then((response) => {
        document.getElementById('addUsername').value = ""
        document.getElementById('addPassword').value = ""
        document.getElementById('addRoles').value = ""
        if (response.ok) {
            showAdminPanel();
        } else {
            alert("Error. Try again")
            showNewUserForm();
        }
    })


}

function showEditUserForm(id) {
    console.log("Работает метод showEditUserForm")
    userFetch.getUser(id)
        .then((res) => {
            res.json().then((user) => {
                console.log(user)
                $("#editId").val(user.id)
                $("#editUsername").val(user.username)
                $("#editPassword").val("")
            })
            $("#editModal").modal()
        })
}


function editUser() {
    const user = {
        id: document.userEditForm.editId.value,
        username: document.userEditForm.editUsername.value,
        password: document.userEditForm.editPassword.value,
        roles: []
    }

    Array.from(editUserForm.editRoles.options)
        .filter(option => option.selected)
        .map(option => option.value)
        .forEach(name => {
            let role = {
                id: 0,
                name: ""
            }
            if (name === "ADMIN") {
                role.id = 1
                role.name = "ADMIN"
            }
            if (name === "USER") {
                role.id = 2
                role.name = "USER"
            }
            user.roles.push(role)
        })

    console.log(user)

    userFetch.updateUser(user).then(res => {
        if (res.ok) {
            console.log("User with username \"" + user.username + "\" updated")
            $("#editModal").modal("hide")
            showAdminPanel()
            if (user.id = currentUserId) {
                updateCurrentUserInfo()
            }
        } else {
            showEditUserForm(user.id)
        }
    }).catch(e => console.log(e))
}

function showDeleteUserForm(id) {
    console.log("Работает метод showDeleteUserForm")
    userFetch.getUser(id)
        .then((res) => {
            res.json().then((user) => {
                console.log(user)
                $("#deleteId").val(user.id)
                $("#deleteUsername").val(user.username)
                $("#deletePassword").val("")
            })
            $("#deleteModal").modal()
        })
}

function deleteUser() {
    userFetch.deleteUser($("#deleteId").val())
        .then(res => {
            if (res.ok) {
                showAdminPanel();
                $("#deleteModal").modal("hide")
            } else {
                alert("Error. Try again")
                showDeleteUserForm();
            }
        })
}