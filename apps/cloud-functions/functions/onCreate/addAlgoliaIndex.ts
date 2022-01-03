import { functions } from '../firebase';
import { algoliaAdminIndex } from '../algolia';
import { DOCUMENT_PATHS } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// addAlgoliaIndex
export const addAlgoliaIndex = functions.firestore.document(DOCUMENT_PATHS.SCHOOL).onCreate((snapshot) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Adds school to the Algolia collection whenever a school document is added to the
  // schools collection so we can query for it.
  //
  // Schools dont get added often, except for when we initially upload all the schools.
  //
  ////////////////////////////////////////////////////////////////////////////////
  if (!snapshot.exists) {
    return;
  }

  const { createdAt, updatedAt, ...data } = snapshot.data();
  const objectID = snapshot.id;

  return algoliaAdminIndex.saveObject({ ...data, objectID });
});
