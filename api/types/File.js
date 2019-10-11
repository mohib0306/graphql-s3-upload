const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} = require('graphql')

exports.FileType = new GraphQLObjectType({
  name: 'File',
  description: 'File type holding info about its props.',
  fields: () => ({
    id: {
      description: 'Unique ID of the file.',
      type: GraphQLNonNull(GraphQLID)
    },
    path: {
      description: 'Location where it is stored on the filesystem.',
      type: GraphQLNonNull(GraphQLString)
    },
    fileName: {
      description: 'Filename, including extension.',
      type: GraphQLNonNull(GraphQLString)
    },
    mimeType: {
      description: 'MIME type.',
      type: GraphQLNonNull(GraphQLString)
    }
  })
})
