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

const getEvent = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:4001/api/v1/events/' + localStorage.getItem('event_id'),
        })
        displayEvent(res.data)
    } catch (err) {
        console.log(err)
    }
}
getEvent()

const displayEvent = (event) => {

    const date = new Date(event.data.event.start_Date);
    const date2 = new Date(event.data.event.end_Date);


    // Format the date as 'Day, Mon DD, YYYY HH:MM AM/PM'
    const options = {
        weekday: 'short',    // Sat
        year: 'numeric',     // 2022
        month: 'short',      // Apr
        day: 'numeric',      // 30
        hour: 'numeric',     // 11
        minute: 'numeric',   // 30
        hour12: true         // AM/PM format
    };

    const formattedDate = date.toLocaleString('en-US', options);
    const formatted_endDate = date2.toLocaleString('en-US', options);

    var title = document.querySelector('.event-title')
    title.innerHTML = event.data.event.eventName
    var title2 = document.querySelector('.event-main-title')
    title2.innerHTML = event.data.event.eventName

    var location = document.querySelector('.event-type-name')
    location.innerHTML = event.data.event.eventType

    var start_date = document.querySelector('#start_date')
    start_date.innerHTML = formattedDate

    var description = document.querySelector('#description')
    description.innerHTML = event.data.event.eventDescription

    var end_date = document.querySelector('#end_date')
    end_date.innerHTML = formatted_endDate

    var location = document.querySelector('#location')
    location.innerHTML = event.data.event.eventLocation
}