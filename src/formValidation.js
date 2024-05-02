import myKey from '../ignore/zipCodeStackAPIKey'

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
                    userDetails[key] = e.target.value
                }
            })
        }
        // Ensure zip code entered by user is valid.
        if (userDetails.zipCode !== '') {
            validateZipCode(userDetails.zipCode).then((result) => {
                console.log(result)
            })
        }
    })
}

function showError(inputElem) {
    console.log(inputElem.parentElement)
}

// In this async function, I installed the local-cors-proxy npm package to workaround the CORS issue that I was
// experiencing when making API requests to zipCodeStack API.
async function validateZipCode(userZipCode) {
    const zipCodeStackURL = new URL('http://localhost:8010/proxy/v1/search')

    zipCodeStackURL.searchParams.append('codes', userZipCode)

    const headers = {
        apikey: myKey,
        Accept: 'application/json',
    }

    const zipCodeResults = fetch(zipCodeStackURL, {
        method: 'GET',
        headers,
    })
        .then((response) => {
            return response.json()
        })
        .catch((err) => {
            return err
        })

    return zipCodeResults
}
