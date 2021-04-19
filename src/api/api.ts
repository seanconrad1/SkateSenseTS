import AsyncStorage from '@react-native-async-storage/async-storage';

// const url = 'http://104.248.236.245:4000/';
const url = 'http://192.168.1.137:4000/';
// const url = __DEV__ ? 'http://localhost:4000/' : 'http://104.248.236.245:4000/';

// endpoints:
const LOGIN = 'login';
const GETSPOTS = 'getSpots';
const CREATE_BOOKMARK = 'createBookmark';
const DELETE_BOOKMARK = 'deleteBookmark';
const GET_BOOKMARKS = 'getBookmarks';
const GET_BOOKMARK = 'getBookmark';
const GET_USER_CREATED_SPOTS = 'getUserCreatedSpots';
const DELETE_SPOT = 'deleteSpot';
const GET_NOT_APPROVED_LIST = 'getNotApprovedList';
const CREATE_SPOT = 'createSpot';
const GET_ADMINS = 'getAdmins';
const APPROVE_SPOT = 'approveSpot';
const GET_SPOT_OWNER = 'getSpotOwner';
const GET_USERS = 'getUsers';
const CREATE_USER = 'createUser';

const callServicePost = async (endpoint: string, data: {}) => {
  let token;
  if (endpoint !== 'login') {
    token = await AsyncStorage.getItem('AUTH_TOKEN');
  }

  const response = await fetch(url + endpoint, {
    method: 'POST',
    cache: 'no-cache',
    body: endpoint !== CREATE_SPOT ? JSON.stringify(data) : data,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    throw { type: 'expiredToken' };
  }

  const result = await response.json();
  console.log('49 api.ts', result);
  return result;
};

/* ----- helper methods ----- */
const callServiceGet = async (endpoint: string) => {
  const token = await AsyncStorage.getItem('AUTH_TOKEN');

  const response = await fetch(url + endpoint, {
    method: 'GET',
    headers: {
      // cache: "no-cache",
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      // Pragma: "no-cache",
      // Expires: "0",
    },
  });
  if (response.status === 401) {
    throw { type: 'expiredToken' };
  }

  const result = await response.json();
  return result;
};
export const loginUser = (email: string, password: string) =>
  // this.getPublicKey((key) => {
  //   const crypt = new Crypt();
  //   const encryptedPassword = crypt.encrypt(key.publicKey, password);
  //   const loginPostData = {
  //     emailAddress: email,
  //     password: encryptedPassword,
  //   };

  callServicePost(LOGIN, { email, password });

export const getSpots = () => callServiceGet(GETSPOTS);

export const createBookmark = (user_id: string, spot_id: string) =>
  callServicePost(CREATE_BOOKMARK, { user_id, spot_id });

export const deleteBookmark = (user_id: string, spot_id: string) =>
  callServicePost(DELETE_BOOKMARK, { user_id, spot_id });

export const getBookmarks = (user_id: string) =>
  callServicePost(GET_BOOKMARKS, { user_id });

export const getBookmark = (user_id: string, spot_id: string) =>
  callServicePost(GET_BOOKMARK, { user_id, spot_id });

export const getUserCreatedSpots = (
  user_id: string,
  latitude: number,
  longitude: number
) => callServicePost(GET_USER_CREATED_SPOTS, { user_id, latitude, longitude });

export const deleteSpot = (_id: string) =>
  callServicePost(DELETE_SPOT, { _id });

export const getNotApprovedList = () => callServiceGet(GET_NOT_APPROVED_LIST);

interface NewSpot {
  (
    name: string,
    location: { latitude: string; longitude: string },
    images: string[],
    description: string,
    kickout_level: number,
    owner: string,
    spotType: string,
    contains: string[]
  ): void;
}

export const createSpot: NewSpot = async (
  name,
  location,
  images,
  description,
  kickout_level,
  owner,
  spotType,
  contains
) => {
  const data = new FormData();

  const locationBlob = new Blob([JSON.stringify(location, null, 2)], {
    type: 'application/json',
  });
  const spotContainsBlob = new Blob([JSON.stringify(contains, null, 2)], {
    type: 'application/json',
  });

  data.append('name', name);
  data.append('location', locationBlob);
  data.append('description', description);
  data.append('kickout_level', kickout_level.toString());
  data.append('owner', owner);
  data.append('spotType', spotType);
  data.append('contains', spotContainsBlob);

  images.forEach((el, idx) => {
    data.append('imgCollection', images[idx]);
  });

  callServicePost(CREATE_SPOT, {
    data,
  });
};

export const getAdmins = () => callServiceGet(GET_ADMINS);

export const approveSpot = (_id: string) =>
  callServicePost(APPROVE_SPOT, { _id });

export const getSpotOwner = (user_id: string) =>
  callServicePost(GET_SPOT_OWNER, { user_id });

export const getUsers = () => callServiceGet(GET_USERS);

interface NewUser {
  (email: string, name: string, password: string, push_token: string): void;
}
export const createUser: NewUser = (email, name, password, push_token) =>
  callServicePost(CREATE_USER, { email, name, password, push_token });
