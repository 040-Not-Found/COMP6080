import { apiCall } from './main.js';
import { hide, show } from './helpers.js';
import { showFeed } from './feed.js';


export const login = () => {
    const payload = {
        email: document.getElementById("loggin_email").value,
        password: document.getElementById("loggin_password").value,
    }
    const headers =  {
        'Content-type': 'application/json',
    }

    const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    };

    apiCall('auth/login', options, data => {
        window.localStorage.setItem('token', data.token);
        show('logged_in_section');
        hide('logged_out_section');
        showFeed();
    });
}