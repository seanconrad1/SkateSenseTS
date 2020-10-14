import gql from 'graphql-tag';

const GET_BOOKMARKS = gql`
  query getBookmarks($user_id: ID!) {
    getBookmarks(user_id: $user_id) {
      _id
      name
      location {
        latitude
        longitude
      }
      description
      images {
        base64
      }
      kickout_level
    }
  }
`;

export default GET_BOOKMARKS;
