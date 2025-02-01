import { showAlert } from "./alert.js"
import { showSpinner, hideSpinner } from "./spinner.js"

const login = async (email, password) => {
  showSpinner()
  try{
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:4001/api/v1/users/login',
      data: {
        email, 
        password
      }
    })
    if (res.data.status === 'success'){
      showAlert('success', 'Logged in succesfully', '#login')
      window.setTimeout(() => {
        if(res.data.data.user.type == 'admin'){
          location.assign('/user')
        }else{
          location.assign('/')
        }
      }, 1500)
      var obj = res.data.data.user
      document.cookie = ' token = ' + JSON.stringify(obj) + ';path=/'
    }
  } catch(err){
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.error
        : err.message
    showAlert('danger', message, '#login')
  }
  hideSpinner()
}

document.querySelector('#login').addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
})

