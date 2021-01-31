const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const schema = buildSchema(`

  input MessageInput {
    content: String,
    author: String
  }

  type Message {
    id: ID!,
    content: String,
    author: String
  }

  type RandomDie {
    numSides: Int!,
    rollOnce: Int!,
    roll(numRolls: Int): [Int]
  }

  type Query {
    hello: String,
    quoteOfTheDay: String,
    random: Float!,
    rollTreeDice: [Int],
    rollDice(numDice: Int!, numSides: Int): [Int],
    getDie(numSides: Int): RandomDie,
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`)

class RandomDie {
  constructor(numSides) {
    this.numSides = numSides
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides)
  }

  roll({ numRolls }) {
    const output = []
    for (let index = 0; index < numRolls; index++) {
      output.push(this.rollOnce())
    }
    return output
  }
}

class Message {
  constructor(id, { content, author }) {
    this.id = id
    this.content = content
    this.author = author
  }
}

const fakeDatabase = {}

const root = {
  hello: () => {
    return 'Hello world!'
  },
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salfation lies whitin'
  },
  random: () => {
    return Math.random()
  },
  rollTreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6))
  },
  rollDice: (args) => {
    const output = []
    for (let index = 0; index < args.numDice; index++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)))
    }
    return output
  },
  getDie: ({ numSides }) => {
    return new RandomDie(numSides || 6)
  },
  getMessage: ({ id }) => {
    if(!fakeDatabase[id]){
      throw new Error(`no message exist with id ${id}`)
    }
    return new Message(id, fakeDatabase[id])
  },
  createMessage: ({ input }) => {
    //create random ID
    const id = require('crypto').randomBytes(10).toString('hex')
    fakeDatabase[id] = input
    return new Message(id, input)
  },
  updateMessage: (id, { input }) => {
    if (fakeDatabase[id]) {
      throw new Error(`no message exist with id ${id}`)
    }
    fakeDatabase[id] = input 
    return new Message(id, input)
  }
}

const app = express()
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(4000)
console.log('app running in 4000');