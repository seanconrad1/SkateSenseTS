import gql from 'graphql-tag';

const USERS_FETCH = gql`
  query getUsers {
    getUsers {
      name
      email
      spots {
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
        contains
        spotType
      }
    }
  }
`;
export default USERS_FETCH;
