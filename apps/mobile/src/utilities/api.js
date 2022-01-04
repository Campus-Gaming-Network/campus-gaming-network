// Libraries
import {
  COLLECTIONS,
  googleMapsLink,
  getEventUrl,
  hasStarted,
  hasEnded,
  formatSchoolName,
  isValidUrl,
  getSchoolUrl,
} from 'utils';
import { doc, collection, query, where, getDoc, getDocs, limit, Timestamp } from 'firebase/firestore';

// Other
import { db } from '../firebase';

const mapEvent = (event) => {
  if (!Boolean(event)) {
    return undefined;
  }

  return {
    ...event,
    creator: event.creator.id,
    createdAt: event.createdAt?.toDate(),
    updatedAt: event.updatedAt?.toDate(),
    url: getEventUrl(event.id),
    googleMapsAddressLink: googleMapsLink(event.location),
    hasStarted: hasStarted(event.startDateTime, event.endDateTime),
    hasEnded: hasEnded(event.endDateTime),
    school: {
      ...event.school,
      createdAt: event.school.createdAt?.toDate(),
      updatedAt: event.school.updatedAt?.toDate(),
      name: formatSchoolName(event.school.name),
      isValidWebsiteUrl: isValidUrl(event.school.website || ''),
      url: getSchoolUrl(event.school.id),
    },
  };
};

const mapEventResponse = (data) => {
  return {
    id: data.event.id,
    title: data.event.name,
    date: data.event.startDateTime.toDate().toDateString(),
    school: data.school.name,
    going: data.event.responses.yes,
    isOnlineEvent: data.event.isOnlineEvent,
    hasStarted: hasStarted(data.event.startDateTime, data.event.endDateTime),
  };
};

export const getUserEvents = async (id, _limit) => {
  let events = null;
  let error = null;

  try {
    const snapshot = await getDocs(
      query(
        collection(db, COLLECTIONS.EVENT_RESPONSES),
        where('user.ref', '==', doc(db, COLLECTIONS.USERS, id)),
        where('response', '==', 'YES'),
        where('event.endDateTime', '>=', Timestamp.fromDate(new Date())),
        limit(_limit),
      ),
    );

    if (!snapshot.empty) {
      events = [];

      snapshot.forEach((doc) => {
        events.push({ ...mapEventResponse(doc.data()) });
      });
    }
  } catch (err) {
    error = err;
  }

  return { events, error };
};

export const getEvent = async (id) => {
  let event = null;
  let error = null;

  try {
    const _doc = await getDoc(doc(db, COLLECTIONS.EVENTS, id));

    if (_doc.exists) {
      event = mapEvent(_doc.data());
    }
  } catch (err) {
    error = err;
  }

  return { event, error };
};

export const getEventUsers = async (id, _limit) => {
  let users = null;
  let error = null;

  try {
    const snapshot = await getDocs(
      query(
        collection(db, COLLECTIONS.EVENT_RESPONSES),
        where('event.ref', '==', doc(db, COLLECTIONS.EVENTS, id)),
        where('response', '==', 'YES'),
        limit(_limit),
      ),
    );

    if (!snapshot.empty) {
      users = [];

      snapshot.forEach((doc) => {
        users.push(doc.data());
      });
    }
  } catch (err) {
    error = err;
  }

  return { users, error };
};
