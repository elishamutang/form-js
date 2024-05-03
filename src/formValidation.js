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
            validateZipCode(userDetails.zipCode)
        }
    })
}

function showError(inputElem) {
    console.log(inputElem.parentElement)
}

async function validateZipCode(userZipCode) {
    const zipCodeStackURL = new URL('https://api.zipcodestack.com/v1/search')

    zipCodeStackURL.searchParams.append('codes', userZipCode)
    zipCodeStackURL.searchParams.append('apikey', myKey)

    console.log(zipCodeStackURL)

    const zipCodeResults = fetch(zipCodeStackURL, {
        method: 'GET',
    })
        .then((response) => {
            return response.json()
        })
        .catch((err) => {
            return err
        })

    zipCodeResults
        .then((response) => {
            return response.results
        })
        .then((results) => {
            console.log(results)
        })

    // We want to check whether country has the correct zip code. To do this:
    // 1. Get country input from input field.
    // 2. Lookup country code
    // 3. Check country code exists in the results for the input zip code.
}
