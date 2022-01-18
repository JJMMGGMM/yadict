#!/usr/bin/env node

/*
 * Yet another cli-dictionary
 * Coded by gmartin3z
 *
 * This program comes with a LICENSE file that you must read
 * before redistributing or modifying this code.
 */

const prompt = require('prompt')
const colors = require('colors/safe')
const fetch = require('node-fetch')

// clear console
process.stdout.write('\033c')

// show instructions
function showInstructions() {
    promise = new Promise(function show(resolve) {
        console.log()
        console.log('Yet another cli-dictionary')
        console.log()
        console.log('* OPTION -> LANGUAGE')
        console.log('* cn -> chinese')
        console.log('* dk -> dutch')
        console.log('* en -> english')
        console.log('* fr -> french')
        console.log('* de -> german')
        console.log('* it -> italian')
        console.log('* jp -> japanese')
        console.log('* pl -> polish')
        console.log('* pt -> portuguese')
        console.log('* ru -> russian')
        console.log('* es -> spanish')
        console.log()
        resolve('SHOW_INSTRUCTIONS')
    })

    return promise
}

// ask for input
function askForInput() {
    promise = new Promise(function ask(resolve, reject) {
        prompt.message = colors.white('- ')
        prompt.delimiter = colors.green()

        const properties = [
            {
                name: 'input_language_code',
                description: colors.white(
                    'What is your language?'
                ),
                enum: ['cn', 'dk', 'en', 'fr', 'de', 'it', 'jp', 'pl', 'pt', 'ru', 'es'],
                warning: 'Invalid origin language',
                required: true
            },
            {
                name: 'output_language_code',
                description: colors.white(
                    'What language do you want translate to?'
                ),
                enum: ['cn', 'dk', 'en', 'fr', 'de', 'it', 'jp', 'pl', 'pt', 'ru', 'es'],
                warning: 'Invalid target language',
                required: true
            },
            {
                name: 'word',
                description: colors.white('Write some word to translate:'),
                warning: 'Write only one word to translate',
                required: true
            }
        ]

        prompt.start()
        prompt.get(properties, function (err, result) {
            if (err) { reject(err) }

            reason = null

            input_language_code = result.input_language_code
            output_language_code = result.output_language_code

            if (input_language_code == output_language_code) {
                reason = 'Origin and target languages cannot be same'
                reject(reason)
            }

            // append full language name to data
            function getLanguage(language_code) {
                language = null
                switch (language_code) {
                    case 'cn':
                        language = 'chinese'
                        break
                    case 'dk':
                        language = 'danish'
                        break
                    case 'en':
                        language = 'english'
                        break
                    case 'fr':
                        language = 'french'
                        break
                    case 'de':
                        language = 'german'
                        break
                    case 'it':
                        language = 'italian'
                        break
                    case 'jp':
                        language = 'japanese'
                        break
                    case 'pl':
                        language = 'polish'
                        break
                    case 'pt':
                        language = 'portuguese'
                        break
                    case 'ru':
                        language = 'russian'
                        break
                    case 'es':
                        language = 'spanish'
                        break
                    default:
                        language = 'english'
                    }


                return language
            }


            result['input_language'] = getLanguage(input_language_code)
            result['output_language'] = getLanguage(output_language_code)

            resolve(result)
        })
    })

    return promise
}


// check response status
function checkStatus(response) {
    promise = new Promise(function disable(resolve, reject) {
        if (response.ok == true) {
            resolve(response.buffer())
        } else {
            reason = 'Cannot download file to server: '
            reject(reason + '(' + response.status + ') ' + response.statusText)
        }
    })

    return promise
}

// start the script
showInstructions()
.then(() => {
    return askForInput()
})
.then((data) => {
    input_lang = data.input_language
    output_lang = data.output_language
    word = data.word

    url = 'https://dict.deepl.com/' + input_lang + '-' + output_lang + '/search?'
    params = 'ajax=1&source=' + input_lang + '&onlyDictEntries=1'
    deepl_url = url + params

    return fetch(deepl_url, {
        'headers': {
            'accept': 'text/html, */*; q=0.01',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Windows NT 6.3)',
        },
        'referrer': 'https://www.deepl.com/translator',
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': 'query=' + word,
        'method': 'POST',
        'mode': 'cors',
        'credentials': 'omit'
    })
    .then(res => res.text())
})
.then((text) => {
    console.log(text)
})
.catch((error) => {
    console.error(colors.red(error))
})
