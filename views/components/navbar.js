const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:4001/api/v1/users/logout',
        })
        if (res.data.status === 'success') {
            location.assign('/')
        }
    } catch (err) {
        console.log(err)
    }
}

var user
if (document.cookie) {
    user = JSON.parse(document.cookie.substring(6))
} else {
    user = JSON.parse('{}')
}

if (!user._id) {
    document.write(`
    <div style="background-color: #FFA500;">
        <div class="container">
            <nav id="navbar" class="navbar navbar-expand-lg">
                <div class="container-fluid p-0">
                           
                    <form class="container-fluid p-0">
                        <div id="interactions" class="d-flex justify-content-between">
                            <div id="navigation" class="d-flex align-items-center justify-content-between w-100 gap-3">
                                <a class="navbar-brand" href="/">
                                    <img src="/images/logo.png" alt="Logo" width="60" class="d-inline-block align-text-top">
                                </a>
                                <div>
                                    <button type="button" class="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
                                 <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#signUpModal">Sign Up</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </nav>
        </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <img src="/images/logo.png" alt="Logo" width="60" class="d-inline-block align-text-top">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="login" class="login-box">
                        <input id="email" type="email" class="form-control mb-3" placeholder="Email" required>
                        <input id="password" type="password" class="form-control mb-3" placeholder="Password" required>

                        <p><a href="/forgot-password" class="link-secondary">Forgot password?</a></p>

                        <button class="btn btn-secondary">Login</button>

                        <div class="d-flex justify-content-center align-items-center">
                            Already have an account? <a class="link-secondary" data-bs-toggle="modal"
                                data-bs-target="#signUpModal">Sign up</a>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>

    <div class="modal fade" id="signUpModal" tabindex="-1" aria-labelledby="signUpModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <img src="/images/logo.png" alt="Logo" width="60" class="d-inline-block align-text-top">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form class="signup-box" id="signup">
                    
                        <input type="text" class="form-control mb-3" placeholder="Name" name="name" id="name1" required>
                        <input type="email" class="form-control mb-3" placeholder="Email" name="email" id="email1" required>
                        <input type="password" class="form-control mb-3" placeholder="Password" name="password" id="password1"
                            required>
                        <input type="password" class="form-control mb-3" placeholder="Confirm Password"
                            name="passwordConfirm" id="passwordConfirm1" required>

                        

                        <button class="btn btn-secondary">Sign up</button>
                        

                            <div class="d-flex justify-content-center align-items-center">
                                Already have an account? <a class="link-secondary" data-bs-toggle="modal"
                                    data-bs-target="#loginModal">Login</a>
                            </div>
                            


                </div>

            </div>
        </div>



    </div>
    `);
} else if (user.type == 'user') {
    document.write(`
        <div id="navbar" style="background-color: #FFA500;">
            <div class="container">
                <nav class="navbar navbar-expand-lg">
                    <div class="container-fluid p-0">
                             
                        <form id="logout" class="container-fluid d-flex align-items-center justify-content-between p-0 gap-3">
                            <div id="navigation" class="d-flex align-items-center gap-3">
                                <a class="navbar-brand" href="/">
                                    <img src="/images/logo.png" alt="Logo" width="60" class="d-inline-block align-text-top">
                                </a>  
                                <a href="/upload-app" class="btn btn-success">Upload +</a>
                            </div>

                            <div class="dropdown" >
                                <button class="border border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #FFA500;">
                                    <i class="bi bi-person-circle" style="font-size: 2rem; color: black"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                <li><div class="dropdown-item"><img src='/images/default.jpg' width=30 height=30>${user.name}</div></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/user/${user._id}">Profile</a></li>
                                <li><button class="dropdown-item">Logout</button></li>
                                </ul>
                            </div>
                        </form>
                    </div>
                </nav>
            </div>
        </div>
    `);
} else if (user.type == 'admin') {
    document.write(`
        <div id="navbar" style="background-color: #FFA500;">
            <div class="container">
                <nav class="navbar navbar-expand-lg">
                    <div class="container-fluid p-0">
                        <a class="navbar-brand" href="/user">
                            <img src="/images/logo.png" alt="Logo" width="60" class="d-inline-block align-text-top">
                        </a>       
                        <form id="logout" class="container-fluid d-flex align-items-center justify-content-between p-0 gap-3">
                            <div id="navigation" class="d-flex align-items-center gap-3">
                                <h2>Admin dashboard</h2>
                            </div>

                            <div class="dropdown">
                                <button class="border border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #FFA500;">
                                    <i class="bi bi-person-circle" style="font-size: 2rem; color: black" ></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                <li><div class="dropdown-item"><img src='/images/default.jpg' width=30 height=30>${user.name}</div></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/user/${user._id}">Profile</a></li>
                                <li><button class="dropdown-item">Logout</button></li>
                                </ul>
                            </div>
                        </form>
                    </div>
                </nav>
            </div>
        </div>
    `);
}

document.querySelector('#logout')?.addEventListener('submit', (e) => {
    e.preventDefault()
    logout()
})

document.getElementById('searchButton')?.addEventListener('click', function () {
    // Hide the navigation links and show the search form
    document.getElementById('navigation').style.display = 'none';
    document.getElementById('searchButton').style.display = 'none';
    document.getElementById('searchForm').classList.add('show');
    document.getElementById('interactions').classList.remove('justify-content-between');
    document.getElementById('interactions').classList.add('justify-content-center');
});

document.getElementById('submitSearch')?.addEventListener('click', function () {
    // Show the navigation links and hide the search form
    document.getElementById('navigation').style.display = 'flex';
    document.getElementById('searchForm').classList.remove('show');
    document.getElementById('searchButton').style.display = 'flex';
    document.getElementById('interactions').classList.remove('justify-content-center');
    document.getElementById('interactions').classList.add('justify-content-between');
});
