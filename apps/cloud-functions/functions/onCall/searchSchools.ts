import { functions } from '../firebase';
import { algoliaSearchIndex } from '../algolia';

////////////////////////////////////////////////////////////////////////////////
// searchSchools
export const searchSchools = functions.https.onCall(async (data, context) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Searches Algolia for schools matching search query.
  //
  // A school is added/removed/updated in Algolia whenever a document is
  // added/removed/updated in the schools collection.
  //
  //
  ////////////////////////////////////////////////////////////////////////////////

  const limit = data.limit > 100 ? 100 : data.limit < 0 ? 0 : data.limit;

  return await algoliaSearchIndex.search(data.query, {
    hitsPerPage: limit,
  });
});
