## Getting Started with GraphQL
> Learning resource to understanding what is GraphQL based on documentation here
[https://graphql.org/graphql-js/](https://graphql.org/graphql-js/)

## Run Query
```
mutation CreateMessage {
  createMessage(input:{
    content:"hi",
    author:"iwan"
  }) {
    id
  }
}

query Exercise{
  hello
  quoteOfTheDay
  rollTreeDice
  random
  rollDice(numDice: 2)
  getDie(numSides: 6) {
    rollOnce
    roll(numRolls: 6)
  }
}

```