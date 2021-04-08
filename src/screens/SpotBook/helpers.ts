import { deleteSpot } from '../../api/api';

export const handleDeleteSpot = async (_id, user_id, callback) => {
  try {
    await deleteSpot(_id);
    callback();
  } catch (e) {
    alert('Unable to delete spot at this time.');
  }
};
