import gql from 'graphql-tag';

const USERS_FETCH = gql`
  query getUsers {
    getUsers {
      name
      bookmarks {
        name
        owner {
          _id
        }
        description
        images {
          base64
        }
        location {
          longitude
          latitude
        }
        kickout_level
      }
    }
  }
`;
export default USERS_FETCH;
