import { showAlert } from "./alert.js"
import { showSpinner, hideSpinner } from "./spinner.js"

const userApps = document.getElementById('user-apps');

function loading() {
  var loadingAppMarkup =
    `<a href="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">Loading...</h5>
            <small class="text-muted">Version 0.0.0</small>
        </div>
        <p class="mb-1">Category:</p>
        <img src="/images/no_photo.png" width="80" height="80" alt="App Icon" class="img-thumbnail mr-3">
    </a>`;

  for (let i = 0; i < 10; i++) {
    userApps.innerHTML += loadingAppMarkup
  }
}

const userId = window.location.href.split('/').pop();

const getUser = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://localhost:4001/api/v1/users/${userId}`,
    })
    if (res.status == 200) {
      document.querySelector('#user-name').textContent = res.data.data.name
      document.getElementById('name').value = res.data.data.name
      document.querySelector('#user-email').textContent = res.data.data.email
      document.getElementById('email').value = res.data.data.email
      document.querySelector('#user-img').src = res.data.data.photo != 'default.jpg' ? res.data.data.user_icon : '/images/default.jpg'
    }
  } catch (err) {
    console.log(err)
  }
}

const getApps = async () => {
  loading();
  try {
    const res = await axios({
      method: 'GET',
      url: `http://localhost:4001/api/v1/apps/owner/${userId}`,
    })
    if (res.status == 200) {
      var apps = res.data.data
      userApps.innerHTML = '';
      for (let i = 0; i < apps.length; i++) {
        userApps.innerHTML +=
          `
          <a href="/app/${apps[i]._id}" class="list-group-item list-group-item-action">
              <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">${apps[i].name}</h5>
                  <small class="text-muted">Version ${apps[i].version}</small>
              </div>
              <p class="mb-1">Category: ${apps[i].category}</p>
              <img src='${apps[i].app_icon ? apps[i].app_icon : '/images/no_photo.png'}' width="80" height="80" alt="App Icon" class="img-thumbnail mr-3">
          </a>
          `
      }

    }
  } catch (err) {
    console.log(err)
  }
}

getUser();
getApps();

document.getElementById('user-confirm-delete').onclick = async (e) => {
  showSpinner();
  try {
    const res = await axios.delete(`http://localhost:4001/api/v1/users/${userId}`)
    if (res.data.status === 'success') {
      showAlert('success', 'User deleted successfully. You will be redirected to the admin homepage', '#form-delete-user')
      window.setTimeout(() => {
        location.assign('/user')
      }, 1500)
    }
  } catch (err) {
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#form-delete-user')
  }
  hideSpinner();
}

document.getElementById('confirm-edit-user').onclick = async (e) => {
  showSpinner();
  const name = document.getElementById('name').value
  const email = document.getElementById('email').value

  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:4001/api/v1/users/updateMe`,
      data: {
        name,
        email
      }
    })
    if (res.data.status === 'success') {
      document.querySelector('#user-name').textContent = name
      document.querySelector('#user-email').textContent = email
      showAlert('success', 'User updated successfully', '#form-edit-user')
    }
  } catch (err) {
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#form-edit-user')
  }
  hideSpinner();
}

document.getElementById('confirm-change-password').onclick = async (e) => {
  showSpinner();
  const password = document.getElementById('password').value
  const passwordConfirm = document.getElementById('passwordConfirm').value
  const passwordCurrent = document.getElementById('passwordCurrent').value

  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:4001/api/v1/users/updateMyPassword`,
      data: {
        passwordCurrent,
        password,
        passwordConfirm
      }
    })
    if (res.data.status === 'success') {
      showAlert('success', 'User password changed successfully', '#form-change-password')
    }
  } catch (err) {
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#form-change-password')
  }
  hideSpinner();
}


if (user.type == 'admin') {
  document.getElementById('delete-user').classList.remove('d-none');
} else if (user._id == userId) {
  document.getElementById('edit-user').classList.remove('d-none');
  document.getElementById('change-password').classList.remove('d-none');
}