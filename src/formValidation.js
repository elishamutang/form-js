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
                console.log(e.target.value)

                e.target.parentElement.querySelector('span').className +=
                    ' active'

                showError(e.target)
            } else {
                e.target.parentElement.querySelector('span').className =
                    'errorMsg'

                e.target.parentElement.querySelector('span').textContent = ''
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
        if (userDetails.zipCode !== '' && userDetails.country !== '') {
            validateZipCode(userDetails.zipCode, userDetails.country)
                .then((result) => {
                    console.log(result)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    })
}

function showError(inputElem) {
    const divElem = inputElem.parentElement
    const spanElem = divElem.querySelector('span')

    if (inputElem.validity.typeMismatch) {
        spanElem.textContent = 'Invalid email address'
    }

    if (inputElem.validity.valueMissing) {
        spanElem.textContent = 'Required field'
    }

    if (inputElem.validity.patternMismatch) {
        spanElem.textContent = 'Invalid input'
    }
}

async function validateZipCode(userZipCode, userCountry) {
    // ZipCodeStack API
    const zipCodeStackURL = new URL('https://api.zipcodestack.com/v1/search')

    zipCodeStackURL.searchParams.append('codes', userZipCode)
    zipCodeStackURL.searchParams.append('apikey', myKey)

    console.log(userCountry)

    // REST Countries API.
    const countriesApi = `https://restcountries.com/v3.1/name/${userCountry}`

    // Fetch zip code data
    const zipCodeResults = fetch(zipCodeStackURL, {
        method: 'GET',
    })
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            return response.results
        })
        .catch((err) => {
            console.error(err)
        })

    // Fetch country information
    const countryResults = fetch(countriesApi, {
        method: 'GET',
    })
        .then((response) => {
            return response.json()
        })
        .then((result) => {
            return result
        })
        .catch((err) => {
            console.error(err)
        })

    // Wait till all promises are settled.
    return Promise.all([countryResults, zipCodeResults])
        .then(([country, zipCode]) => {
            const [countryCode] = country[0].altSpellings
            console.log(countryCode)

            const zipCodeInput = zipCode[userZipCode]

            // Initial result
            let result = false

            zipCodeInput.forEach((obj) => {
                if (obj.country_code === countryCode) {
                    result = true
                }
            })

            return result
        })
        .then((result) => {
            return result
        })
}
