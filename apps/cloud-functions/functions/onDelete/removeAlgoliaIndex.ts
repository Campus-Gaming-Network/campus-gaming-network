import { functions } from '../firebase';
import { algoliaAdminIndex } from '../algolia';
import { DOCUMENT_PATHS } from '../constants';

////////////////////////////////////////////////////////////////////////////////
// removeAlgoliaIndex
export const removeAlgoliaIndex = functions.firestore.document(DOCUMENT_PATHS.SCHOOL).onDelete((snapshot) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // If a school document is deleted, remove the document from Algolia so that it
  // can no longer be queried.
  //
  ////////////////////////////////////////////////////////////////////////////////
  if (!snapshot.exists) {
    return;
  }

  return algoliaAdminIndex.deleteObject(snapshot.id);
});
