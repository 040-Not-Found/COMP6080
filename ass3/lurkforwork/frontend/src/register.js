import { apiCall } from './main.js';
import { hide, show } from './helpers.js';
import { showFeed } from './feed.js';

export const register = () => {
    const password = document.getElementById("res_password").value;
    const comfirm_pass = document.getElementById("comfirm_pass").value;
    if (password != comfirm_pass) {
        alert("The passwords doe not match")
    } else {
        const payload = {
            name: document.getElementById("res_name").value,
            email: document.getElementById("res_email").value,
            password: password,
        }
        const headers =  {
            'Content-type': 'application/json',
        }

        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        };

        apiCall('auth/register', options, data => {
            window.localStorage.setItem('token', data.token);
            hide('register_section');
            show('logged_in_section');
        });
    }
}