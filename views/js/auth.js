export const getUser = () => {
  var user
  if (document.cookie) {
      user = JSON.parse(document.cookie.substring(6))
  } else {
      user = JSON.parse('{}')
  }

  return user
}