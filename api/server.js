const { ApolloServer } = require('apollo-server-koa')
const Koa = require('koa')
const config = require('./config')
const S3Context = require('./ctx/S3')
const { schema } = require('./schema')

const app = new Koa()
const server = new ApolloServer({
  uploads: {
    // Limits here should be stricter than config for surrounding
    // infrastructure such as Nginx so errors can be handled elegantly by
    // graphql-upload:
    // https://github.com/jaydenseric/graphql-upload#type-processrequestoptions
    maxFileSize: 10000000, // 10 MB
    maxFiles: 20
  },
  schema,
  context: { S3Context }
})

server.applyMiddleware({ app })

app.listen(config.APP_PORT, error => {
  if (error) throw error

  console.info(
    `Serving http://localhost:${config.APP_PORT} for ${config.NODE_ENV}.`
  )
})
