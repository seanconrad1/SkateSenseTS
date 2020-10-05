import gql from 'graphql-tag';

const GET_NOT_APPROVED_LIST = gql`
  query getNotApprovedList {
    getNotApprovedList {
      _id
      approved
      images {
        base64
      }
      description
      name
      location {
        latitude
        longitude
      }
      kickout_level
      owner {
        name
      }
    }
  }
`;

export default GET_NOT_APPROVED_LIST;
