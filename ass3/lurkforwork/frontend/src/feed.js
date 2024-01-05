import {apiCall} from './main.js';
import { getName } from './helpers.js';
// basic feed
export const showFeed = () => {
    const headers = {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
    }
    const options = {
        method: 'GET',
        headers: headers,
    };
    apiCall('job/feed?start=0', options, data => {
        showFeedHelper(data)
    })
}

const showFeedHelper = (data) => {
    // sort data in reverse chronological order
    data.sort(function(a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    const footer = document.getElementById("footer");
    for (const item of data) {
        const card = createPost(item);
        footer.parentNode.insertBefore(card, footer);
    }
}

export function createPost(post) {
    const author = getName(post.creatorId);
    const postTime = getPostTime(post.createdAt);

    const card = document.createElement('div');
    card.setAttribute("class", "card");
    card.post = post;

    // user
    card.innerHTML = "Post by: ";
    const user = document.createElement('span');
    user.id = post.creatorId;
    user.setAttribute('class', 'user');
    user.innerHTML = author;
    card.appendChild(user);

    card.innerHTML += '<br>' + "Posted: " + postTime  + "<br>";

    const content = getContent(post);
    card.appendChild(content)

    return card;
}

function getPostTime(time) {
    const today = new Date();
    const jobPostedDate = new Date(time); 

    const timeDiff = today.getTime() - jobPostedDate.getTime(); 
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60)); 
    
    if (hoursDiff < 24) {
        // job was posted within the last 24 hours
        const minutesDiff = Math.floor((timeDiff / (1000 * 60)) % 60);
        return `${hoursDiff} hours and ${minutesDiff} minutes ago`;
    } else {
        // job was posted more than 24 hours ago
        return jobPostedDate.toLocaleDateString();
    }
}

function getContent(post) {
    const content = document.createElement('container');

    content.innerHTML = "Title: " + post.title + "<br>";
    content.innerHTML +=  "Start date: " + new Date(post.start).toLocaleDateString() + "<br>";
    content.innerHTML += "Description: " + post.description + "<br>";

    content.appendChild(likeButton(post))
    content.appendChild(commentButton(post))

    const img = document.createElement('img');
    img.setAttribute("class", "srcPic");
    img.src = post.image;
    img.alt = 'Image'
    content.appendChild(img)
    
    return content;
}

function likeButton(post) {
    const result = document.createElement('div');

    const like = document.createElement('button');
    like.id = 'like';
    like.value = '&#128077';
    like.innerHTML = '&#128077';
    result.appendChild(like);

    const button = document.createElement('button');
    button.id = "likeButton";

    button.innerHTML += "Likes: " + post.likes.length + "<br>";

    result.appendChild(button);

    button.onclick = showLikes(post.likes, result);

    return result;
}

const showLikes = (likes, button) => {
    const popUp = document.createElement('div');
    popUp.setAttribute("class", "hide");
    popUp.id = "likePopup";
    if (likes.length > 0) {
        popUp.innerHTML = "Liked by: <br>";
        for (const like of likes) {
            const user = document.createElement('span');
            user.id = like.userId;
            user.setAttribute('class', 'user');
            user.innerHTML = like.userName;
            popUp.appendChild(user);
        }
    }
    button.appendChild(popUp);
}

function commentButton (post) {
    const result = document.createElement('div');

    const button = document.createElement('button');
    button.id = "commentButton";
    button.innerHTML += "Comments: " + post.comments.length + "<br>";
    
    result.appendChild(button);
    
    button.onclick = showComment(post.comments, result);

    return result;
}

const showComment = (comments, button) => {
    const popUp = document.createElement('div');
    popUp.setAttribute("class", "hide");
    popUp.id = "commentPopup";
    if (comments.length > 0) {
        popUp.innerHTML = "Commented by: <br>";
        for (const comment of comments) {
            // users
            const user = document.createElement('span');
            user.id = comment.userId;
            user.setAttribute('class', 'user');
            user.innerHTML = comment.userName;
            popUp.appendChild(user);

            // descriptions
            const desc = document.createElement('span');
            desc.setAttribute('class', 'description');
            desc.innerHTML = ": " + comment.comment + "<br>";
            popUp.appendChild(desc);

        }
    }
    button.appendChild(popUp);
}

export const changeThumb = (button, post) => {
    // like post
    likeJob(post);
    button.setAttribute('class', 'liked');
}

export const likeJob = (post) => {
    const payload = {
        id: post.id,
        turnon: true,
    }
    const headers = {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
    }
    const options = {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(payload)
    };
    apiCall('job/like', options, data => {
        console.log('Liked')
    })
}