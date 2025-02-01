const usersTable = document.getElementById('users');

function loading() {
  var loadingUserMarkup =
    `<tr>
    <td><img src="/img/default.jpg" height="100" width="100" alt="Profile Pic" class="img-thumbnail"></td>
    <td></td>
    <td></td>
    <td><button class="btn btn-secondary" onclick="previewUser(1)">Preview</button></td>
  </tr>`;

  for (let i = 0; i < 10; i++) {
    usersTable.innerHTML += loadingUserMarkup
  }
}


const getUsers = async () => {
  loading();
  try {
    const res = await axios({
      method: 'GET',
      url: `http://localhost:4001/api/v1/users`,
    })
    if (res.status == 200) {
      var users = res.data.data
      usersTable.innerHTML = '';
      for (let i = 0; i < users.length; i++) {
        if(users[i].type == 'admin'){
          continue;
        }

        usersTable.innerHTML +=
          `
          <tr>
            <td><img src='${users[i].photo != 'default.jpg' ? users[i].photo : '/images/default.jpg'}' height="100" width="100" alt="Profile Pic" class="img-thumbnail"></td>
            <td>${users[i].name}</td>
            <td>${users[i].email}</td>
            <td><a href='/user/${users[i]._id}' class="btn btn-secondary" onclick="previewUser(1)">Preview</a></td>
          </tr>
          `
      }

    }
  } catch (err) {
    console.log(err)
  }
}

getUsers();

