import { apiCall } from './main.js';
import { createPost } from './feed.js';
import { getName } from './helpers.js';

export const viewProfile = (id) => {
    const headers =  {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
    }

    const options = {
        method: 'GET',
        headers: headers,
    };
    apiCall(`user?userId=${id}`, options, data => {
        showProfileHelper(data);
    });
}

const showProfileHelper = (user) => {
    const footer = document.getElementById("footer");

    const prof = document.createElement('div');
    prof.setAttribute('class', 'profile');
    
    prof.innerHTML = "<H3>Profile</H3>"
        + "Name: " + user.name + '<br>';

    // watch by
    prof.appendChild(watchBy(user));

    // show jobs
    const jobList = document.createElement('div');
    if (user.jobs.length > 0) {
        const jobs = user.jobs;
        jobList.setAttribute('class', 'jobs')
        jobList.innerHTML = "Jobs: ";
        for (const post of jobs) {
            jobList.appendChild(createPost(post));
        }
    }

    prof.appendChild(jobList);
    footer.parentNode.insertBefore(prof, footer);
}

const watchBy = (user) => {
    const result = document.createElement('div');

    const button = document.createElement('button');
    button.id = 'watchButton';
    const watchee = user.watcheeUserIds;
    button.innerHTML = 'Watchee:' + watchee.length;
    
    result.appendChild(button)
    
    button.onclick = showWatchee(watchee, result);

    return result;
}

const showWatchee = (watchee, button) => {
    const popUp = document.createElement('div');
    popUp.setAttribute("class", "hide");
    popUp.id = "watchPopup";
    if (watchee.length > 0) {
        popUp.innerHTML = "Watched by: <br>";
        const watcheeList = document.createElement('div')
        watcheeList.setAttribute('class', 'watchee')

        for (const watch of watchee) {
            const name = getName(watch);
            const user = document.createElement('div');
            user.id = watch;
            user.setAttribute('class', 'user');
            user.innerHTML = name;
            watcheeList.appendChild(user);
        }
        popUp.appendChild(watcheeList);
    }
    button.appendChild(popUp);
}