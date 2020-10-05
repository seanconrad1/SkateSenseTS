import gql from 'graphql-tag';

const GET_MY_SPOTS = gql`
  query getUserCreatedSpots($user_id: ID!) {
    getUserCreatedSpots(user_id: $user_id) {
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
export default GET_MY_SPOTS;
