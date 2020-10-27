import gql from 'graphql-tag';

const GET_ADMINS = gql`
  query getAdmins {
    getAdmins {
      push_token
    }
  }
`;

export default GET_ADMINS;
