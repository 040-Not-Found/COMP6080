/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */

import { apiCall } from "./main.js";

export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

export function show (element) {
    document.getElementById(element).classList.remove('hide');
}

export function hide (element) {
    document.getElementById(element).classList.add('hide');
}

export function popupHelper(element, id) {
    const div = element.parentNode;
    const popup = div.querySelector(id);
    if (popup.classList.value == '') {
        popup.classList.add('hide');
    } else {
        popup.classList.remove('hide');
    }
}

export function hideAll() {
    var divs = document.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++) {
        divs[i].style.display = 'none';        
    }
}

export function getName(id) {
    const headers =  {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
    }

    const options = {
        method: 'GET',
        headers: headers,
    };

    apiCall(`user?userId=${id}`, options, data => {
        window.localStorage.removeItem('data');
        window.localStorage.setItem('data', JSON.stringify(data));
    });

    const userData = JSON.parse(localStorage.getItem('data'));
    return userData.name || '';
}
