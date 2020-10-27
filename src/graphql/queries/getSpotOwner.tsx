// 5f9263c4678bf20c6213b05e

import gql from 'graphql-tag';

const GET_SPOT_OWNER = gql`
  query getSpotOwner($user_id: ID!) {
    getSpotOwner(user_id: $user_id) {
      push_token
    }
  }
`;

export default GET_SPOT_OWNER;
