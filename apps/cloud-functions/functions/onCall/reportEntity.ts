import { db, functions } from '../firebase';
import { COLLECTIONS } from '../constants';
import { InvalidRequestError, NotAuthorizedError } from '../errors';

////////////////////////////////////////////////////////////////////////////////
// reportEntity
export const reportEntity = functions.https.onCall(async (data, context) => {
  if (!data || !context) {
    throw new InvalidRequestError();
  }

  if (!context.auth || !context.auth.uid) {
    throw new NotAuthorizedError();
  }

  const reportData = {
    reportingUser: {
      ref: db.collection(COLLECTIONS.USERS).doc(context.auth.uid),
      id: context.auth.uid,
    },
    reason: data.reason,
    metadata: data.metadata,
    entity: data.entity,
    reportedEntity: {},
    status: 'new',
  };

  let reportedEntityDoc;

  try {
    reportedEntityDoc = await db.collection(data.entity.type).doc(data.entity.id).get();
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  if (reportedEntityDoc && reportedEntityDoc.exists) {
    reportData.reportedEntity = {
      ...reportedEntityDoc.data(),
      ref: reportedEntityDoc.ref,
    };
  }

  try {
    await db.collection(COLLECTIONS.REPORTS).add(reportData);
  } catch (error: any) {
    throw new functions.https.HttpsError(error.code, error.message);
  }

  return { success: true };
});
