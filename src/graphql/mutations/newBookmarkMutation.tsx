import gql from 'graphql-tag';

const NEW_BOOKMARK_MUTATION = gql`
  mutation createBookmark($bookmarkInput: bookmarkInputData) {
    createBookmark(bookmarkInput: $bookmarkInput) {
      _id
    }
  }
`;

export default NEW_BOOKMARK_MUTATION;
