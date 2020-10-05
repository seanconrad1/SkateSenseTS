import gql from 'graphql-tag';

const DELETE_BOOKMARK_MUTATION = gql`
  mutation deleteBookmark($bookmarkInput: bookmarkInputData) {
    deleteBookmark(bookmarkInput: $bookmarkInput) {
      _id
    }
  }
`;
export default DELETE_BOOKMARK_MUTATION;
