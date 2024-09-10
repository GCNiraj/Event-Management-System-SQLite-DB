import { showAlert } from './alert.js'
import { logout } from './logout.js'

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
        showAlert('Unauthorized', 'You need to be valid user')
        window.setTimeout(()=>{
            location.assign('/');
        },1500)
    }
}catch (err){
    showAlert('Unauthorized', 'You need to be valid user. Login to access this functionality')
    console.log(err)
    window.setTimeout(()=>{
        location.assign('/');
    },1500)
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
            const transactionID = res.data.data.transaction_ID;
            console.log(transactionID)
            const qrData = JSON.stringify({
                transactionID,   // Only store minimal data, like transaction ID
                attendee_CID,    // Attendee ID
            });

            const secretKey = 'secret-key'; // Use your secret key
            const encryptedData = CryptoJS.AES.encrypt(qrData, secretKey).toString();

            // Wait for a moment, then redirect to the confirmation page
            window.setTimeout(() => {
                location.assign(`/bookingConfirmed?data=${encodeURIComponent(encryptedData)}`);
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