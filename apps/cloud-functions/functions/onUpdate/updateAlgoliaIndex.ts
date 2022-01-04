import { functions } from '../firebase';
import { algoliaAdminIndex } from '../algolia';
import { DOCUMENT_PATHS } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// updateAlgoliaIndex
export const updateAlgoliaIndex = functions.firestore.document(DOCUMENT_PATHS.SCHOOL).onUpdate((change) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Updates the school in Algolia whenever the school gets updated in firestore.
  //
  // A school can be updated manually by admins or via the edit school page by school admins.
  //
  ////////////////////////////////////////////////////////////////////////////////
  const { createdAt, updatedAt, ...newData } = change.after.data();
  const objectID = change.after.id;

  return algoliaAdminIndex.saveObject({ ...newData, objectID });
});
