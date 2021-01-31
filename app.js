const numDice = 3
const numSides = 6
const query = `
  query RollDice($numDice: Int!, $numSides: Int) {
    rollDice(numDice: $numDice, numSides: $numSides)
  }
`
fetch('/graphql', {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: {
    query,
    variables: { numDice, numSides } 
  }
})
.then(r => r.json())
.then(data => console.log('data returned : ', data))