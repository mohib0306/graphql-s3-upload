const { GraphQLUpload } = require('apollo-server-koa')
const { GraphQLList, GraphQLObjectType, GraphQLNonNull } = require('graphql')
const { FileType } = require('./File')

exports.MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    singleUpload: {
      description: 'Stores a single file.',
      type: GraphQLNonNull(FileType),
      args: {
        file: {
          description: 'File to store.',
          type: GraphQLNonNull(GraphQLUpload)
        }
      },
      resolve: (parent, { file }, { S3Context }) => S3Context.storeObject(file)
    },
    multipleUpload: {
      description: 'Stores multiple files.',
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(FileType))),
      args: {
        files: {
          description: 'Files to store.',
          type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLUpload)))
        }
      },
      async resolve(parent, { files }, { S3Context }) {
        const { resolve, reject } = await Promise.all(
          files.map(file => S3Context.storeObject(file))
        )

        if (reject.length)
          reject.forEach(({ name, message }) =>
            console.error(`${name}: ${message}`)
          )

        return resolve
      }
    }
  })
})
