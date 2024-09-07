import { showAlert } from './alert.js'

export const signup = async (cid, name, email , address, phonenumber, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: "POST",
            url: 'http://localhost:4001/api/v1/users/signup',
            data: {
                cid,
                name,
                email,
                phonenumber,
                address,
                password,
                passwordConfirm
            },
        })
        
        if (res.data.status === 'success') {
            showAlert('success','Account created successfully!')
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
    } catch (err) {
        let message = 
            typeof err.response !== 'undefined'
                ? err.response.data.message
                : err.message
        showAlert('error', 'Error: Passwords are not the same!',message)
    }
}

document.querySelector('#form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const cid = document.getElementById('cid').value
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const passwordConfirm = document.getElementById('confirm_password').value
    signup(cid, name, email, "changzamtog",Math.floor(10000000 + Math.random() * 90000000), password, passwordConfirm)
})