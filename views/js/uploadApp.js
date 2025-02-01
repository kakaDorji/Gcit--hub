import { showAlert } from "./alert.js"
import { showSpinner, hideSpinner } from "./spinner.js"

const upload = async (name, description, version, category) => {
  showSpinner()

  var obj
  if (document.cookie) {
      obj = JSON.parse(document.cookie.substring(6))
  } else {
      obj = JSON.parse('{}')
  }
  const owner_id = obj._id

  try{
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:4001/api/v1/apps',
      data: {
        name, 
        description,
        version,
        category,
        owner_id
      }
    })
    if (res.data.status === 'success'){
      showAlert('success', 'App repository started successfully! Now you can upload app related data', '#upload-app')
      window.setTimeout(() => {
        location.assign(`/app/edit/${res.data.data._id}`)
      }, 1500)
      // var obj = res.data.data.user
      // document.cookie = ' token = ' + JSON.stringify(obj)
    }
  } catch(err){
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#upload-app')
  }
  hideSpinner()
}

document.querySelector('#upload-app').addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.getElementById('app-name').value
    const desc = document.getElementById('app-description').value
    const vers = document.getElementById('app-version').value
    const cat = document.getElementById('category').value
    upload(name, desc, vers, cat)
})
document.querySelector('.btn-danger').addEventListener('click', (e) => {
  location.assign(`/`)
})

