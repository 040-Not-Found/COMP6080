import { BACKEND_PORT } from './config.js';
import { fileToDataUrl, hide, show, popupHelper, hideAll } from './helpers.js';
import { login } from './login.js'
import { register } from './register.js';
import { changeThumb } from './feed.js';
import { viewProfile } from './profile.js';


export function apiCall (path, options, success) {
    return fetch("http://localhost:5005/" + path, options)
        .then(res => {
            return res.json()
            .then(data => {
                if (data.error) {
                    alert(data.error)
                } else if (res.status === 200){
                    success(data);
                }
            })
        })
}

// go to log in page
document.getElementById('go_loggin').addEventListener('click', () => {
    hide('logged_out_section');
    show('register_section');
})

// go to register page
document.getElementById('go_register').addEventListener('click', () => {
    hide('register_section');
    show('logged_out_section');
})

// logout and go to log in page
document.getElementById('logout').addEventListener('click', () => {
    hide('logged_in_section');
    window.localStorage.removeItem('token');
    // remove feeds
    let get = Array.from(document.getElementsByClassName('card'));
        get.forEach(element => {
        element.remove();
    });
    get = Array.from(document.getElementsByClassName('profile'));
        get.forEach(element => {
        element.remove();
    });
    show('logged_out_section');
})

// login
document.getElementById("submit_button").addEventListener('click', () => {
    login();
})

// register
document.getElementById("register_button").addEventListener('click', ()=> {
    register();
})

// listeners
document.addEventListener("click", function(event) {
    const element = event.target;
    if (element.id == 'likeButton') {
        popupHelper(element, '#likePopup');
    } else if (element.id == 'commentButton') {
        popupHelper(element, '#commentPopup');
    } else if (element.id == 'like') {
        const job = element.parentNode.parentNode.parentNode;
        changeThumb(element, job.post);
    } else if (element.classList.contains('user')) {
        hideAll();
        viewProfile(element.id);
    } else if (element.id == 'watchButton') {
        popupHelper(element, '#watchPopup');
    } else if (element.id == 'myProfile') {
        // TODO
        console.log("show my profile")
    }
});






