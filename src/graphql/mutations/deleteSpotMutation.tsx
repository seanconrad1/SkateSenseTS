import gql from 'graphql-tag';

const DELETE_SPOT_MUTATION = gql`
  mutation deleteSpot($_id: ID!) {
    deleteSpot(_id: $_id)
  }
`;

export default DELETE_SPOT_MUTATION;
