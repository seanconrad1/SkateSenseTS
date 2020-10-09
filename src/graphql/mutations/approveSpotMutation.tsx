import gql from 'graphql-tag';

const APPROVE_SPOT_MUTATION = gql`
  mutation approveSpotMutation($_id: ID!) {
    approveSpotMutation(_id: $_id)
  }
`;
export default APPROVE_SPOT_MUTATION;
