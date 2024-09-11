import { showAlert } from './alert.js'
import { logout } from './logout.js';

window.onload = function() {
    allEvents();
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
        obj = JSON.parse('{}');
        throw new Error("Unauthorized access");
        
    }
}catch (err){
    showAlert('error', 'Error: Unautorized Access', message)
    location.assign("/")
}


const allEvents = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:4001/api/v1/events/user/'+obj.cid,
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
        var el1 = card.querySelector('.coupon-status')
        var el2 = card.querySelector('.card-event-dt')

        

        const date = new Date(element.end_Date);  // Convert to Date object

        // Format to a readable string
        const readableDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        el1.innerHTML = '' + readableDate
        el2.innerHTML = '</h5>' + element.eventName+'</h5>'
        card.querySelector('#img').src = element.media_Links
        el2.setAttribute('id',element.eventid)
        el2.addEventListener('click',()=> recordId(element.eventid))

        var card2 = document.querySelector('#card')
        card2.insertAdjacentElement('afterend', card)
    }
    document.querySelector('#card').remove()
    document.querySelectorAll('.total_event_counter')[0].innerHTML = arr.length
    document.querySelectorAll('.total_event_counter')[2].innerHTML = arr.length
}

function recordId(id){
    localStorage.setItem('event_id',id)
    location.assign('/event_details')
}