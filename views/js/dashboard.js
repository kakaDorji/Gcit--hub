const colLeft = document.getElementById('col-left');
const colRight = document.getElementById('col-right');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

var apps;
var filteredApps;

function loading() {
  var loadingSmallAppMarkup =
    `<div class="col-3 image-container2" onclick="window.location.href='#';">
      <div class="row">
        <div class="col-5">
          <div class="d-flex justify-content-center align-items-center rounded clickable-image2 border border-black " role="status">
            <div class="spinner-border" style="width: 2rem; height: 2rem;" role="status">
            </div>
          </div>
        </div>
        <div class="col-5">
          <h5 class="text-left" style="margin-top: 10px;"></h5>
          <p class="text-left mt-2"></p>
        </div>
      </div>
    </div>`;

  colLeft.innerHTML = '';
  colRight.innerHTML = '';
  
  for (let i = 0; i < 6; i++) {
    if (i % 2 == 0) {
      colLeft.innerHTML += loadingSmallAppMarkup
    } else {
      colRight.innerHTML += loadingSmallAppMarkup
    }
  }
}

function displayApps(appsToDisplay) {
  colLeft.innerHTML = '';
  colRight.innerHTML = '';
  
  if (appsToDisplay.length === 0) {
    const noResultsMarkup = `
      <div class="col-12 text-center py-4">
        <h5>No apps found matching your search.</h5>
      </div>
    `;
    colLeft.innerHTML = noResultsMarkup;
    return;
  }

  for (let i = 0; i < appsToDisplay.length; i++) {
    var markup =
      `<div class="col-3 image-container2" onclick="window.location.href='/app/${appsToDisplay[i]._id}'">
        <div class="row">
          <div class="col-5">
            <img class="rounded clickable-image2 object-fit-cover" src='${appsToDisplay[i].app_icon ? appsToDisplay[i].app_icon : '/images/no_photo.png'}'>
          </div>
          <div class="col-5">
            <h5 class="text-left" style="margin-top: 10px;">${appsToDisplay[i].name}</h5>
            <p class="text-left mt-2">${appsToDisplay[i].version}</p>
          </div>
        </div>
      </div>`;
    
    if (i % 2 == 0) {
      colLeft.innerHTML += markup;
    } else {
      colRight.innerHTML += markup;
    }
  }
}

function searchApps() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (!searchTerm) {
    filteredApps = apps;
  } else {
    filteredApps = apps.filter(app => 
      app.name.toLowerCase().includes(searchTerm) ||
      app.version.toLowerCase().includes(searchTerm)
    );
  }
  
  displayApps(filteredApps);
}

// Event listeners for search
searchBtn.addEventListener('click', searchApps);
searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    searchApps();
  }
});

// Clear search when input is cleared
searchInput.addEventListener('input', () => {
  if (searchInput.value === '') {
    displayApps(apps);
  }
});

const getApps = async () => {
  loading();
  try {
    const res = await axios({
      method: 'GET',
      url: `http://localhost:4001/api/v1/apps`,
    })
    if (res.status == 200) {
      apps = res.data.data;
      filteredApps = apps; // Initialize filtered apps with all apps
      displayApps(apps);
    }
  } catch (err) {
    console.log(err);
    colLeft.innerHTML = `
      <div class="col-12 text-center py-4">
        <h5>Error loading apps. Please try again later.</h5>
      </div>
    `;
  }
}

getApps();
