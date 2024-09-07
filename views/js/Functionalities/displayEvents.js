import { showAlert } from './alert.js'

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
if (document.cookie) {
    var tokenString = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    var obj = JSON.parse(tokenString);
} else {
    obj = JSON.parse('{}');
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
allEvents()

const displayEvents = (event) => {
    var arr = event.data
    for (let i = 0; i < arr.length; i++) {
        var card = document.querySelector('#card').cloneNode(true)
        var el1 = card.querySelector('.publish-date')
        var el2 = card.querySelector('.event-title')

        const element = arr[i]

        const date = new Date(element.end_Date);  // Convert to Date object

        // Format to a readable string
        const readableDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        el1.innerHTML = '' + readableDate
        el2.innerHTML = '' + element.eventName

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