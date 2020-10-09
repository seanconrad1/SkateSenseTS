import gql from 'graphql-tag';

const GET_MY_SPOTS = gql`
  query getUserCreatedSpots($locationInput: LocationInput!) {
    getUserCreatedSpots(locationInput: $locationInput) {
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
      distance
      contains
      spotType
    }
  }
`;
export default GET_MY_SPOTS;
