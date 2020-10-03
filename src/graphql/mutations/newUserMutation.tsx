import gql from 'graphql-tag';

const CREATE_USER = gql`
  mutation createUser($userInput: userInputData) {
    createUser(userInput: $userInput) {
      user_id
      name
      email
      token
    }
  }
`;

export default CREATE_USER;
