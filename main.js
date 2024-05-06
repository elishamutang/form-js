;(() => {
    'use strict'
    var t = {}
    function e(t) {
        const e = t.parentElement.querySelector('span')
        ;(document.querySelector('button').disabled = !0),
            (e.className = 'errorMsg active'),
            Array.from(t.classList).includes('invalid') || (t.className += ' invalid'),
            t.validity.typeMismatch && (e.textContent = 'Invalid email address'),
            t.validity.valueMissing && (e.textContent = 'Required field'),
            t.validity.patternMismatch && (e.textContent = 'Invalid input'),
            'pwdConfirm' === t.id && (e.textContent = "Password doesn't match."),
            'country' === t.id && (e.textContent = 'Invalid country.'),
            'zipCode' === t.id && (e.textContent = 'Invalid zip code.')
    }
    async function r(t, e) {
        try {
            const r = `https://restcountries.com/v3.1/name/${e}`,
                n = await fetch(r)
            let a
            if (!n.ok) throw new Error(n.status)
            ;(await n.json()).forEach((t) => {
                t.name.common.toLowerCase() === e.toLowerCase() && (a = t.cca2)
            })
            const o = `https://zip-api.eu/api/v1/codes/postal_code=${a}-${t}`,
                s = await fetch(o)
            if (s.ok) return !0
            if (400 === s.status) throw new Error('Invalid country/zipcode entered.')
            throw new Error(s.status)
        } catch (t) {
            return console.error(t), !1
        }
    }
    ;(t.g = (function () {
        if ('object' == typeof globalThis) return globalThis
        try {
            return this || new Function('return this')()
        } catch (t) {
            if ('object' == typeof window) return window
        }
    })()),
        (() => {
            var e
            t.g.importScripts && (e = t.g.location + '')
            var r = t.g.document
            if (!e && r && (r.currentScript && (e = r.currentScript.src), !e)) {
                var n = r.getElementsByTagName('script')
                if (n.length) for (var a = n.length - 1; a > -1 && (!e || !/^http(s?):/.test(e)); ) e = n[a--].src
            }
            if (!e) throw new Error('Automatic publicPath is not supported in this browser')
            ;(e = e
                .replace(/#.*$/, '')
                .replace(/\?.*$/, '')
                .replace(/\/[^\/]+$/, '/')),
                (t.p = e)
        })()
    const n = t.p + 'coverPic.jpg'
    ;(document.querySelector('img').src = n),
        (function () {
            const t = document.querySelector('form'),
                n = document.getElementById('submitBtn')
            n.disabled = !0
            const a = { uemail: '', pwd: '', pwdConfirm: '', country: '', zipCode: '' }
            t.addEventListener('input', (t) => {
                if ('INPUT' === t.target.tagName)
                    if (((n.disabled = !0), t.target.checkValidity())) {
                        const e = t.target.parentElement.querySelector('span')
                        ;(e.className = 'errorMsg'),
                            (e.textContent = ''),
                            Array.from(t.target.classList).includes('invalid') &&
                                (t.target.className = Array.from(t.target.classList)
                                    .filter((t) => 'invalid' !== t)
                                    .map((t) => t))
                    } else e(t.target)
            }),
                t.addEventListener('focusout', (o) => {
                    'INPUT' === o.target.tagName &&
                        Object.keys(a).forEach((t) => {
                            t === o.target.id && (a[t] = o.target.value)
                        })
                    const s = new Promise((t, e) => {
                        if ('' !== a.pwd && '' !== a.pwdConfirm) {
                            const r = document.getElementById('pwdConfirm')
                            a.pwd === a.pwdConfirm ? t(r) : e(r)
                        }
                    })
                        .then(
                            (t) => (
                                (t.className = 'userInput'),
                                (t.parentElement.querySelector('span').className = 'errorMsg'),
                                !0
                            )
                        )
                        .catch((t) => (e(t), !1))
                    t.checkValidity() &&
                        Promise.all([r(a.zipCode, a.country), s])
                            .then(([t, r]) => {
                                const n = document.getElementById('country'),
                                    a = document.getElementById('zipCode'),
                                    s = o.target === n ? n : a
                                if (t) {
                                    const t = n.parentElement.querySelector('span'),
                                        e = a.parentElement.querySelector('span')
                                    ;(t.className = 'errorMsg'),
                                        (e.className = 'errorMsg'),
                                        Array.from(n.classList).includes('invalid')
                                            ? (n.className = Array.from(n.classList)
                                                  .filter((t) => 'invalid' !== t)
                                                  .map((t) => t))
                                            : Array.from(a.classList).includes('invalid') &&
                                              (a.className = Array.from(a.classList)
                                                  .filter((t) => 'invalid' !== t)
                                                  .map((t) => t))
                                } else e(s)
                                return [t, r]
                            })
                            .then(([t, e]) => {
                                n.disabled = !t || !e
                            })
                            .catch((t) => {
                                console.error(t)
                            })
                }),
                t.addEventListener('submit', (t) => {
                    t.preventDefault()
                    const e = Object.fromEntries(new FormData(t.target).entries())
                    console.log(e),
                        Array.from(document.querySelectorAll('input')).forEach((t) => {
                            t.value = ''
                        }),
                        (n.disabled = !0),
                        alert('Check your login info in the console (press F12)')
                })
        })()
})()
