import { showAlert } from './alert.js'

var obj 
if (document.cookie) {
    var tokenString = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    var obj = JSON.parse(tokenString);
} else {
    obj = JSON.parse('{}');
}

const checkout = async (event_ID, attendee_CID, total_Amount, no_of_tickets) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4001/api/v1/payments',
            data: {
                event_ID,
                attendee_CID,
                total_Amount,
                no_of_tickets
            },
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Payment is successful');

            // Store the data to encode in the QR code
            const qrData = JSON.stringify({
                event_ID,
                attendee_CID,
                total_Amount,
                no_of_tickets
            });

            // Wait for a moment, then redirect to the confirmation page
            window.setTimeout(() => {
                location.assign(`/bookingConfirmed?data=${encodeURIComponent(qrData)}`);
            }, 1500);
        }
    } catch (err) {
        let message = typeof err.response !== 'undefined' ? err.response.data.message : err.message;
        showAlert('error', 'Error: Incorrect Details', message);
    }
}


document.querySelector('#registerevent').addEventListener('click', (e) => {
    e.preventDefault()
    const total_Amount = parseInt(document.querySelector('.ttl-clr').textContent.match(/(\d+)/)[0])
    const event_ID = localStorage.getItem('event_id')
    const attendee_CID = obj["cid"]
    const no_of_tickets = parseInt(document.querySelector('.order-number').textContent)
    checkout(event_ID, attendee_CID, total_Amount, no_of_tickets)
})