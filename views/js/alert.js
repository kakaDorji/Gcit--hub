export const hideAlert = () => {
  const alerts = document.querySelectorAll('.alert')
  alerts.forEach(alert => {
    alert.parentElement.removeChild(alert)
  });
}
  
export const showAlert = (type, msg, selector) => {
  hideAlert()
  const markup = `<div class="alert alert-${type}" role="alert">
                    ${msg}
                  </div>`
  document.querySelector(selector).insertAdjacentHTML('afterend', markup)
}