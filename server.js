const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const expressValidator = require('express-validator')
const fs = require('fs')
const words = fs.readFileSync('/usr/share/dict/words', 'utf-8').toLowerCase().split('\n')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

app.engine('mst', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mst')

const randomWord = words[Math.floor(Math.random() * words.length)]

app.get('/', (req, res) => {
  res.render('home')
})

app.post('/', (req, res) => {
  // function that sorts through the 'words file' and picks a word at random.
  console.log(randomWord)
  // let secretWord = []
  // secretWord.push(randomWord)
  let secretWord = randomWord.split('')
  console.log(secretWord)

  let answer = secretWord.map(currentItem => {
    if (req.body.guess === currentItem) {
      return currentItem
    } else {
      return '_'
    }
  }).join('')
  console.log({ answer })
  res.render('home')
})

// let answer = secretWord.forEach((currentItem) => {
//   if (req.body.guess === currentItem) {
//     res.render('home', req.body.guess)
//   } else {
//     let notCorrect = req.body.guess
//     notCorrect = '_'
//     res.render('home', notCorrect)
//   }
// })

app.listen(3000, () => {
  console.log('may the force be with you')
})
