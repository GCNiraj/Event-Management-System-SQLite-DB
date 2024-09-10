import { showAlert } from './alert.js'

window.onload = function() {
    allEvents();
}

// Logging Out
const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:4001/api/v1/users/logout',
        })
        if (res.data.status === 'success') {
            document.cookie = ''
            location.reload(true)
        }
    } catch (err) {
        showAlert('error', 'Error logging out! Try again.')
    }
}

var obj
try{
    if (document.cookie) {
        var tokenString = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
        var obj = JSON.parse(tokenString);
        document.querySelector('#logout').addEventListener('click', (e) => logout())
        document.querySelector('#photo').src = 'images/users/'+obj.photo
        document.querySelector('#photo2').src = 'images/users/'+obj.photo
        document.querySelector('#name').innerHTML = obj.name 
        document.querySelector('#email').innerHTML = obj.email
    } else {
        document.querySelector('.main-btn.btn-hover').style.display = 'none'
        document.querySelector('.create-btn.btn-hover').style.display = 'none'
        document.querySelector('.dropdown.account-dropdown').style.display = 'none'
        obj = JSON.parse('{}');
    }
}catch (err){
    console.log(err)
}


const allEvents = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:4001/api/v1/events',
        })
        displayEvents(res.data)
    } catch (err) {
        console.log(err)
    }
}

const displayEvents = (event) => {
    var arr = event.data
    for (let i = 0; i < arr.length; i++) {

        const element = arr[i]

        if (document.getElementById(element.eventid)){
            continue
        }
        var card = document.querySelector('#card').cloneNode(true)
        var el1 = card.querySelector('.publish-date')
        var el2 = card.querySelector('.event-title')

        

        const date = new Date(element.end_Date);  // Convert to Date object

        // Format to a readable string
        const readableDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        el1.innerHTML = '' + readableDate
        el2.innerHTML = '' + element.eventName
        card.querySelector('#img').src = element.media_Links
        el2.setAttribute('id',element.eventid)
        el2.addEventListener('click',()=> recordId(element.eventid))

        var card2 = document.querySelector('#card')
        card2.insertAdjacentElement('afterend', card)
    }
    document.querySelector('#card').remove()
}

function recordId(id){
    localStorage.setItem('event_id',id)
    location.assign('/event_details')
}