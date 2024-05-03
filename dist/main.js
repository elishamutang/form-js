;(() => {
    'use strict'
    var t = {}
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
                var c = r.getElementsByTagName('script')
                if (c.length)
                    for (
                        var n = c.length - 1;
                        n > -1 && (!e || !/^http(s?):/.test(e));

                    )
                        e = c[n--].src
            }
            if (!e)
                throw new Error(
                    'Automatic publicPath is not supported in this browser'
                )
            ;(e = e
                .replace(/#.*$/, '')
                .replace(/\?.*$/, '')
                .replace(/\/[^\/]+$/, '/')),
                (t.p = e)
        })()
    const e = t.p + 'danist-soh-dqXiw7nCb9Q-unsplash.jpg'
    ;(document.querySelector('img').src = e),
        (function () {
            const t = document.querySelector('form'),
                e = {
                    uemail: '',
                    pwd: '',
                    pwdConfirm: '',
                    country: '',
                    zipCode: '',
                }
            t.addEventListener('input', (t) => {
                var e
                'INPUT' === t.target.tagName &&
                    (t.target.checkValidity() ||
                        ((e = t.target), console.log(e.parentElement)))
            }),
                t.addEventListener('focusout', (t) => {
                    'INPUT' === t.target.tagName &&
                        Object.keys(e).forEach((r) => {
                            r === t.target.id && (e[r] = t.target.value)
                        }),
                        '' !== e.zipCode &&
                            (async function (t) {
                                const e = new URL(
                                    '"https://api.zipcodestack.com/v1/search"'
                                )
                                e.searchParams.append('codes', t),
                                    fetch(e, {
                                        method: 'GET',
                                        headers: {
                                            apikey: '01HWT573XA2A9RBTX16QRRJ9N8',
                                            Accept: 'application/json',
                                        },
                                    })
                                        .then((t) => t.json())
                                        .catch((t) => t)
                                        .then((t) => t.results)
                                        .then((t) => {
                                            console.log(t)
                                        })
                            })(e.zipCode)
                })
        })()
})()
