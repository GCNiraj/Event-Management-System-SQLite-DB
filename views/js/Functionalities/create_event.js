import { showAlert } from './alert.js'

var obj 
if (document.cookie) {
    var tokenString = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    var obj = JSON.parse(tokenString);
} else {
    obj = JSON.parse('{}');
}

const create = async (eventmanagerCID,eventName, eventType, start_Date, end_Date, eventDescription, eventLocation) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4001/api/v1/events',
            data : {
                eventmanagerCID,
                eventName,
                eventType,
                start_Date,
                end_Date,
                eventDescription,
                eventLocation
            },
        })
        if (res.data.status === 'success') {
            showAlert('success', 'Event Created successfully')
            window.setTimeout(() => {
                window.open('/', '_blank');
            }, 1500)
            var obj = res.data.data.user
            document.cookie = ' token = ' + JSON.stringify(obj)
        }
    } catch (err) {
        let message = 
            typeof err.response !== 'undefined'
                ?err.response.data.message
                :err.message
        showAlert('error', 'Error: Incorrect or missing details',message)
    }
}


document.querySelector('#event_add').addEventListener('click', (e) => {
    e.preventDefault()
    const event_name = document.querySelector("#event_name").value
    const event_category = document.querySelector("#event_category").value
    const start_date = document.querySelector("#start_date").value
    const end_date = document.querySelector("#end_date").value
    const event_description = editor.getData().replace("<p>","").replace("</p>","")
    const event_location = document.querySelector("#event_location").value

    create(obj["cid"], event_name, event_category, start_date, end_date, event_description, event_location)
})