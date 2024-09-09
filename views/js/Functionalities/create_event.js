import { showAlert } from './alert.js'

var obj 
if (document.cookie) {
    var tokenString = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    var obj = JSON.parse(tokenString);
} else {
    obj = JSON.parse('{}');
}

const uploadBanner = async(eventid) => {
    const form = new FormData()
    form.append('eventid', eventid)
    form.append('mediaLink', document.getElementById('thumb-img').files[0])
    try {
        const res = await axios({
            method: 'PUT',
            url: 'http://localhost:4001/api/v1/events/updateBanner',
            data: form,
            headers: {
                'Content-Type': 'multipart/form-data'  // Important for file uploads
            }
        })
        if (res.data.status === 'success') {
            window.setTimeout(()=>{
                location.assign('/');
            },2000)
        }
    } catch (err) {
        console.log(err)
    }
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
            if (document.getElementById('thumb-img').files[0]!== undefined){
                uploadBanner(res.data.data.eventid)
            }
            showAlert('success', 'Event Created Successfully')
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