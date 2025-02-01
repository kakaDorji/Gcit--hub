import { showSpinner, hideSpinner } from "./spinner.js";

const appId = window.location.href.split('/').pop();

const getApp = async () => {
  showSpinner();
  try {
    const res = await axios({
      method: 'GET',
      url: `http://localhost:4001/api/v1/apps/${appId}`,
    })
    if (res.status == 200) {
      document.querySelector('#app-name').textContent = res.data.data.name
      document.querySelector('#app-category').textContent = res.data.data.category
      document.querySelector('#app-version').textContent = res.data.data.version
      document.querySelector('#app-description').textContent = res.data.data.description
      document.querySelector('#app-size').textContent = res.data.data.app_path ? `${res.data.data.app_size} MB` : 'No file'
      document.querySelector('#app-icon-img').src = res.data.data.app_icon ? res.data.data.app_icon : '/images/no_photo.png'
      document.querySelector(".user h6").textContent = user.name;

      if (user._id && user._id == res.data.data.owner_id) {
        document.querySelector('#user-btns').innerHTML += `
          <a href='/app/edit/${appId}' class="btn btn-success  me-2">Edit</a>
          `
      }
      if (res.data.data.app_path) {
        document.querySelector('#user-btns').innerHTML += `
          <a href='${res.data.data.app_path}' class="btn text-white  me-2" style="background-color: orange" download>Download</a>
          `
      } else {
        document.querySelector('#user-btns').innerHTML += `
          <button disabled class="btn  me-2 disabled text-white "  style="background-color: #FFA500" >No download available</button>
          `
      }

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
      hideSpinner()
    }
  } catch (err) {
    console.log(err)
  }
}

getApp();

