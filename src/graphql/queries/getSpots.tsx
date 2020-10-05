import gql from 'graphql-tag';

const GET_SPOTS = gql`
  query getSpots {
    getSpots {
      _id
      name
      location {
        latitude
        longitude
      }
      description
      kickout_level
      images {
        base64
      }
    }
  }
`;

export default GET_SPOTS;
