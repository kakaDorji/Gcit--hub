export const hideSpinner = () => {
  const spinners = document.querySelectorAll('.spinner-border')
  spinners.forEach(spinner => {
    spinner.parentElement.removeChild(spinner)
  });
  
  const btns = document.querySelectorAll('.btn')
  btns.forEach(btn => {
    btn.disabled = false
  })
}
  
export const showSpinner = () => {
  hideSpinner()
  const btns = document.querySelectorAll('.btn')
  btns.forEach(btn => {
    btn.disabled = true
    var spinner = document.createElement("div")
    spinner.classList.add("spinner-border", "spinner-border-sm", "ms-1")
    btn.appendChild(spinner)
  })
}