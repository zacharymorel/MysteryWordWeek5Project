const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const expressValidator = require('express-validator')
const expressSession = require('express-session')
const fs = require('fs')
const words = fs.readFileSync('/usr/share/dict/words', 'utf-8').toLowerCase().split('\n')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

app.engine('mst', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mst')

app.use(
  expressSession({
    secret: 'jar jar binks',
    resave: false,
    saveUninitialized: true
  })
)

app.get('/', (request, response) => {
  // put the random word in session if it doesnt exist
  if (!request.session.superSecretWord){
    request.session.superSecretWord = words[Math.floor(Math.random() * words.length)]
  }
  if (!request.session.guessedLetters){
    request.session.guessedLetters = []
  }
  console.log("the word is " , request.session.superSecretWord)
  let count = 8

  let guess = request.session.superSecretWord.split('')
  .map(letter => {
    if (request.session.guessedLetters.indexOf(letter) >= 0 ) {
      return letter
    } else {
      return '_'
    }
  })
  .join('')
  if (guess === '_') {
    count = count - 1
  }
  console.log('the word so far is ', guess)
  response.render('home', {
    superSecretWord: request.session.superSecretWord,
    guess: guess,
    guessed: request.session.guessedLetters,
    count: count})
})




app.post('/Create', (request, response) => {
  // incoming from the form on the client side, we are getting a letter
  // store that incoming in session, in a list of characters
  const guessedLetters = request.session.guessedLetters || []
  guessedLetters.push(request.body.guess)

  // console.log(request.session.guess);
  request.session.guessedLetters = guessedLetters
  response.redirect('/')
})

app.listen(3000, () => {
  console.log('may the force be with you')
})
