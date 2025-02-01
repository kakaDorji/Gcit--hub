import { showAlert } from "./alert.js"
import { showSpinner, hideSpinner } from "./spinner.js"

const appId = window.location.href.split('/').pop();

const getApp = async () => {
  showSpinner();
  try {
    const res = await axios({
      method: 'GET',
      url: `http://localhost:4001/api/v1/apps/${appId}`,
    })
    if (res.status == 200) {
      document.querySelector('#app-name').value = res.data.data.name
      document.querySelector('#btn-preview').href = `/app/${res.data.data._id}`
      document.querySelector('#app-version').value = res.data.data.version
      document.querySelector('#app-description').value = res.data.data.description
      document.querySelector('#category').value = res.data.data.category
      document.querySelector('#app-icon-img').src = res.data.data.app_icon ? res.data.data.app_icon : '/images/no_photo.png'
      document.querySelector('#app-size').textContent = res.data.data.app_path ? `${res.data.data.app_size} MB` : 'No file'
      var screenshots = document.querySelector('#screenshots')
      if (!res.data.data.screenshots.length) {
        screenshots.textContent = 'No screenshots'
      } else {
        res.data.data.screenshots.forEach(screenshot => {
          var img = document.createElement("img")
          img.style.width = '250px';
          img.style.height = '350px';
          img.classList.add("object-fit-cover", "border", "rounded")
          img.src = screenshot
          screenshots.appendChild(img)
        });
      }
      hideSpinner();
    }
  } catch (err) {
    console.log(err)
  }
}

document.getElementById('edit-app').onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById('app-name').value
  const version = document.getElementById('app-version').value
  const description = document.getElementById('app-description').value
  const category = document.getElementById('category').value

  showSpinner()
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:4001/api/v1/apps/${appId}`,
      data: {
        name,
        version,
        description,
        category
      }
    })
    if (res.data.status === 'success') {
      showAlert('success', 'App details updated!', '#edit-app')
    }
  } catch (err) {
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#edit-app')
  }
  hideSpinner()
}

document.getElementById('edit-icon').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.currentTarget;

  showSpinner();
  try {
    const formData = new FormData(form);
    const res = await axios.post(`http://localhost:4001/api/v1/apps/${appId}/icon`, formData)
    if (res.data.status === 'success') {
      showAlert('success', 'Icon changed successfully', '#edit-icon')
      const type = document.querySelector('#app-icon').files[0].name.split('.').pop();
      document.querySelector('#app-icon-img').src = `/uploads/apps/${appId}/icon.${type}`
    }
  } catch (err) {
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#edit-icon')
  }
  hideSpinner();
}

document.getElementById('remove-icon').onclick = async (e) => {
  showSpinner();
  try {
    const res = await axios.delete(`http://localhost:4001/api/v1/apps/${appId}/icon`)
    if (res.data.status === 'success') {
      showAlert('success', 'Icon removed successfully', '#edit-icon')
      document.querySelector('#app-icon-img').src = '/images/no_photo.png'
    }
  } catch (err) {
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#edit-icon')
  }
  hideSpinner();
}

document.getElementById('save-app').onsubmit = async (e) => {
  e.preventDefault();
  const size = Math.round((document.querySelector('#app-file').files[0].size / 1024 / 1024) * 100) / 100;
  const form = e.currentTarget;

  showSpinner();
  try {
    const formData = new FormData(form);
    const res = await axios.post(`http://localhost:4001/api/v1/apps/${appId}/file/${size}`, formData)
    if (res.data.status === 'success') {
      showAlert('success', 'App uploaded successfully', '#save-app')
      document.querySelector('#app-size').textContent = `${size} MB`
    }
  } catch (err) {
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#save-app')
  }
  hideSpinner();
}

document.getElementById('remove-file').onclick = async (e) => {
  showSpinner();
  try {
    const res = await axios.delete(`http://localhost:4001/api/v1/apps/${appId}/file`)
    if (res.data.status === 'success') {
      showAlert('success', 'App file removed successfully', '#save-app')
      document.querySelector('#app-size').textContent = 'No file'
    }
  } catch (err) {
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#save-app')
  }
  hideSpinner();
}

document.getElementById('save-screenshots').onsubmit = async (e) => {
  e.preventDefault();
  const files = document.querySelector('#screenshot-input').files;
  const form = e.currentTarget;

  showSpinner();
  try {
    const formData = new FormData(form);
    const res = await axios.post(`http://localhost:4001/api/v1/apps/${appId}/screenshots`, formData)
    if (res.data.status === 'success') {
      showAlert('success', 'Screenshots uploaded successfully', '#save-screenshots')
      var screenshots = document.querySelector('#screenshots')
      screenshots.innerHTML = '';
      for (var i = 0; i < files.length; i++) {
        var img = document.createElement("img")
        img.style.width = '250px';
        img.style.height = '350px';
        img.classList.add("object-fit-cover", "border", "rounded")
        img.src = `/uploads/apps/${appId}/screenshots/${files[i].name}`
        screenshots.appendChild(img)
      }
    }
  } catch (err) {
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#save-screenshots')
  }
  hideSpinner();
}

document.getElementById('remove-screenshots').onclick = async (e) => {
  showSpinner();
  try {
    const res = await axios.delete(`http://localhost:4001/api/v1/apps/${appId}/screenshots`)
    if (res.data.status === 'success') {
      showAlert('success', 'Screenshots removed successfully', '#save-screenshots')
      var screenshots = document.querySelector('#screenshots')
      screenshots.innerHTML = '';
      screenshots.textContent = 'No screenshots'
    }
  } catch (err) {
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#save-screenshots')
  }
  hideSpinner();
}

document.getElementById('delete-app-btn').onclick = async (e) => {
  showSpinner();
  try {
    const res = await axios.delete(`http://localhost:4001/api/v1/apps/${appId}`)
    if (res.data.status === 'success') {
      showAlert('success', 'App deleted successfully. You will be redirected to the homepage', '#delete-app')
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }
  } catch (err) {
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#delete-app')
  }
  hideSpinner();
}

getApp();