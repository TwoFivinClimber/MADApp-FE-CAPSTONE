import { deleteSingleDay, getDaysbyUid } from '../day/dayData';
import { getEventsByUid } from '../events/eventData';
import { deleteEvent } from '../events/mergedEvents';
import { deleteThisUser } from './userData';

const deleteUser = (firebaseKey, uid) => new Promise((resolve, reject) => {
  getEventsByUid(uid).then((eventsArr) => {
    getDaysbyUid(uid).then((daysArr) => {
      if (eventsArr.length) {
        const deleteEvents = eventsArr.map((event) => deleteEvent(event.firebaseKey));
        Promise.all(deleteEvents).then(resolve);
      } if (daysArr.length) {
        const deleteDays = daysArr.map((day) => deleteSingleDay(day.firebaseKey));
        Promise.all(deleteDays).then(resolve);
      }
      deleteThisUser(firebaseKey).then(resolve);
    }).then(resolve);
  }).catch(reject);
});

// eslint-disable-next-line import/prefer-default-export
export { deleteUser };
