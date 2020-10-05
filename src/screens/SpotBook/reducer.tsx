export const spotBookState = {
  mySpots: [],
  bookmarkedSpots: [],
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_SPOTS':
      return { ...state, mySpots: action.payload };
    case 'SET_BOOKMARKS':
      return { ...state, bookmarkedSpots: action.payload };
    case 'DELETE_BOOKMARK':
      return {
        ...state,
        bookmarkedSpots: state.bookmarkedSpots.filter(
          i => i._id !== action.payload,
        ),
      };
    case 'DELETE_SPOT':
      return {
        ...state,
        mySpots: state.mySpots.filter(i => i._id !== action.payload),
      };
    default:
      throw new Error();
  }
}
