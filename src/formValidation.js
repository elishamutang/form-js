export default function formValidation() {
    const formElem = document.querySelector('form')

    // User object
    const userDetails = {
        uemail: '',
        pwd: '',
        pwdConfirm: '',
        country: '',
        zipCode: '',
    }

    // When user is typing.
    formElem.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            if (!e.target.checkValidity()) {
                showError(e.target)
            }
        }
    })

    // Saves value when user clicks out of input field.
    formElem.addEventListener('focusout', (e) => {
        if (e.target.tagName === 'INPUT') {
            Object.keys(userDetails).forEach((key) => {
                if (key === e.target.id) {
                    console.log(e.target.checkValidity())
                    userDetails[key] = e.target.value
                }
            })
        }
        console.log(userDetails)
    })
}

function showError(inputValue) {
    console.log(inputValue)
}
