import gql from 'graphql-tag';

const NEW_SPOT_MUTATION = gql`
  mutation createSpot($spotInput: spotInputData) {
    createSpot(spotInput: $spotInput) {
      _id
      name
      description
      location {
        longitude
        latitude
      }
      kickout_level
      images {
        base64
      }
    }
  }
`;

export default NEW_SPOT_MUTATION;
