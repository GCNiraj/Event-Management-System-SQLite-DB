// Logging Out
export const logout = async () => {
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