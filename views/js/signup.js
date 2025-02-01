import { showAlert } from "./alert.js"
import { showSpinner, hideSpinner } from "./spinner.js"

const signup = async (name, email, password, passwordConfirm) => {
    console.log("Hi")
  showSpinner()
  try{
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:4001/api/v1/users/signup',
      data: {
        name,
        email, 
        password,
        passwordConfirm
      }
    })
    if (res.data.status === 'success'){
      showAlert('success', 'Registered succesfully', '#signup')
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
      var obj = res.data.data.user
      document.cookie = ' token = ' + JSON.stringify(obj) + ';path=/'
    }
  } catch(err){
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#signup')
  }
  hideSpinner()
}

document.getElementById('signup').addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.getElementById('name1').value
    const email = document.getElementById('email1').value
    const password = document.getElementById('password1').value
    const passwordConfirm = document.getElementById('passwordConfirm1').value
    signup(name, email, password, passwordConfirm)
})

