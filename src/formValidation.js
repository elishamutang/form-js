import myKey from '../ignore/zipCodeStackAPIKey'

export default function formValidation() {
    const formElem = document.querySelector('form')

    const submitBtn = document.getElementById('submitBtn')
    submitBtn.disabled = true

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
            submitBtn.disabled = true
            if (!e.target.checkValidity()) {
                showError(e.target)
            } else {
                const spanElem = e.target.parentElement.querySelector('span')
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

        // Wait for validateZipCode and isPwdIdentical to resolve, then process output.
        if (formElem.checkValidity()) {
            Promise.all([validateZipCode(userDetails.zipCode, userDetails.country), isPwdIdentical])
                .then(([zipCodeValidate, pwdValidate]) => {
                    const countryDivElem = document.getElementById('country')
                    const zipCodeDivElem = document.getElementById('zipCode')

                    const relevantElem = e.target === countryDivElem ? countryDivElem : zipCodeDivElem

                    if (!zipCodeValidate) {
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

                    return [zipCodeValidate, pwdValidate]
                })
                .then(([zipCodeValidate, pwdValidate]) => {
                    // Enable submit button after validating zipcode and password
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
    try {
        // REST Countries API.
        const countriesApi = `https://restcountries.com/v3.1/name/${userCountry}`

        // Fetch country information
        const countryResponse = await fetch(countriesApi)

        let countryCode

        if (countryResponse.ok) {
            const countryResults = await countryResponse.json()
            countryResults.forEach((value) => {
                if (value.name.common.toLowerCase() === userCountry.toLowerCase()) {
                    countryCode = value.cca2
                }
            })
        } else {
            throw new Error(countryResponse.status)
        }

        // Validate country against zip code.
        const zipCodeApi = `https://zip-api.eu/api/v1/codes/postal_code=${countryCode}-${userZipCode}`

        const zipCodeResponse = await fetch(zipCodeApi)

        if (zipCodeResponse.ok) {
            return true
        } else {
            if (zipCodeResponse.status === 400) throw new Error('Invalid country/zipcode entered.')

            throw new Error(zipCodeResponse.status)
        }
    } catch (err) {
        console.error(err)
        return false
    }
}
