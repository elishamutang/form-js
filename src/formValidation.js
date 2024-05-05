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
            const spanElem = e.target.parentElement.querySelector('span')
            if (!e.target.checkValidity()) {
                showError(e.target)
            } else {
                spanElem.className = 'errorMsg'
                spanElem.textContent = ''

                if (Array.from(e.target.classList).includes('invalid')) {
                    e.target.className = Array.from(e.target.classList)
                        .filter((value) => {
                            return value !== 'invalid'
                        })
                        .map((value) => {
                            return value
                        })
                }
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
                    const countryDivElem = document.getElementById('country')
                    const zipCodeDivElem = document.getElementById('zipCode')

                    const relevantElem = e.target === countryDivElem ? countryDivElem : zipCodeDivElem

                    if (!result) {
                        // Country and zip code doesn't match, show error.
                        showError(relevantElem)
                    } else {
                        const countryDivSpan = countryDivElem.parentElement.querySelector('span')
                        const zipCodeDivSpan = zipCodeDivElem.parentElement.querySelector('span')

                        // Remove active class from country and zipcode inputs if result from validateZipCode is true.
                        countryDivSpan.className = 'errorMsg'
                        zipCodeDivSpan.className = 'errorMsg'

                        if (Array.from(countryDivElem.classList).includes('invalid')) {
                            countryDivElem.className = Array.from(countryDivElem.classList)
                                .filter((value) => {
                                    return value !== 'invalid'
                                })
                                .map((value) => {
                                    return value
                                })
                        } else if (Array.from(zipCodeDivElem.classList).includes('invalid')) {
                            zipCodeDivElem.className = Array.from(zipCodeDivElem.classList)
                                .filter((value) => {
                                    return value !== 'invalid'
                                })
                                .map((value) => {
                                    return value
                                })
                        }
                    }

                    return result
                })
                .catch((err) => {
                    console.log(err)

                    const countryDivElem = document.getElementById('country')
                    const zipCodeDivElem = document.getElementById('zipCode')

                    const relevantElem = e.target === countryDivElem ? countryDivElem : zipCodeDivElem

                    showError(relevantElem)
                })
        }
        // Ensure pwd and pwdConfirm is equal. If not, call showError.
        const isPwdIdentical = new Promise((resolve, reject) => {
            if (userDetails.pwd !== '' && userDetails.pwdConfirm !== '') {
                const pwdConfirmInput = document.getElementById('pwdConfirm')
                if (userDetails.pwd === userDetails.pwdConfirm) {
                    resolve(pwdConfirmInput)
                } else {
                    reject(pwdConfirmInput)
                }
            }
        })
            .then((pwdConfirmInput) => {
                pwdConfirmInput.className = 'userInput'
                pwdConfirmInput.parentElement.querySelector('span').className = 'errorMsg'
                return true
            })
            .catch((err) => {
                showError(err)
                return false
            })

        // !* RE-THINK THIS (currently validateZipCode is called twice)
        // Wait for validateZipCode and isPwdIdentical to resolve, then process output.
        if (formElem.checkValidity()) {
            Promise.all([validateZipCode(userDetails.zipCode, userDetails.country), isPwdIdentical])
                .then(([zipCodeValidate, pwdValidate]) => {
                    if (zipCodeValidate && pwdValidate) {
                        submitBtn.disabled = false
                    } else {
                        submitBtn.disabled = true
                    }
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    })

    formElem.addEventListener('submit', (e) => {
        e.preventDefault()

        const submittedData = Object.fromEntries(new FormData(e.target).entries())

        console.log(submittedData)
    })
}

// Show error for each input field
function showError(inputElem) {
    const divElem = inputElem.parentElement
    const spanElem = divElem.querySelector('span')

    const submitBtn = document.querySelector('button')
    submitBtn.disabled = true

    spanElem.className = 'errorMsg active'

    if (!Array.from(inputElem.classList).includes('invalid')) {
        inputElem.className += ' invalid'
    }

    if (inputElem.validity.typeMismatch) {
        spanElem.textContent = 'Invalid email address'
    }

    if (inputElem.validity.valueMissing) {
        spanElem.textContent = 'Required field'
    }

    if (inputElem.validity.patternMismatch) {
        spanElem.textContent = 'Invalid input'
    }

    if (inputElem.id === 'pwdConfirm') {
        spanElem.textContent = "Password doesn't match."
    }

    if (inputElem.id === 'country') {
        spanElem.textContent = 'Invalid country.'
    }

    if (inputElem.id === 'zipCode') {
        spanElem.textContent = 'Invalid zip code.'
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

            if (zipCodeInput !== undefined || country !== undefined) {
                zipCodeInput.forEach((obj) => {
                    if (obj.country_code === countryCode) {
                        result = true
                    }
                })
            }

            return result
        })
        .catch((err) => {
            console.error(err)
            return false
        })
}
