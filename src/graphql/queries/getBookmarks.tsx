import gql from 'graphql-tag';

const GET_BOOKMARKS = gql`
  query getUser($user_id: ID!) {
    getUser(user_id: $user_id) {
      name
      bookmarks {
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
  }
`;

export default GET_BOOKMARKS;
