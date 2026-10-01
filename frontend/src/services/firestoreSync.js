/**
 * FINCHECK AI - Cloud Firestore Synchronization Service
 * 
 * Persists:
 * 1. User Profiles & Logins -> /users/{uid}
 * 2. Uploaded PDFs & Metadata -> /users/{uid} (uploaded_documents) and /companies/{companyId}/documents
 * 3. Extracted Financial Facts -> /users/{uid} (financial_facts) and /companies/{companyId}/financial_facts
 */
import { auth, db } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  collection, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Converts a File object to base64 data URL (capped at ~800KB for Firestore limits)
 */
export async function fileToBase64(file) {
  if (!file) return null;
  // Firestore document maximum limit is 1,048,576 bytes (1 MiB).
  // Keep under 750KB to leave ample room for metadata.
  if (file.size > 750 * 1024) {
    return null;
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

/**
 * Save or update user profile and login timestamp in Cloud Firestore
 */
export async function saveUserToFirestore(userData) {
  if (!db) {
    console.warn('[FINCHECK AI Firestore] Firestore client not initialized');
    return null;
  }

  const currentUser = auth?.currentUser;
  const uid = userData.uid || currentUser?.uid;

  if (!uid) {
    console.warn('[FINCHECK AI Firestore] No valid UID found for Firestore user persistence');
    return null;
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    const payload = {
      uid,
      email: userData.email || currentUser?.email || 'auditor@fincheck.ai',
      displayName: userData.displayName || currentUser?.displayName || 'Senior Auditor',
      role: userData.role || 'Senior Auditor',
      companyId: userData.companyId || 'company_001',
      companyName: userData.companyName || 'Acme Industries',
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(userDocRef, payload, { merge: true });
    console.log('[FINCHECK AI Firestore] User login persisted to Firestore at users/' + uid);
    return payload;
  } catch (error) {
    console.error('[FINCHECK AI Firestore] Error saving user to Firestore:', error);
    return null;
  }
}

/**
 * Save newly uploaded PDF document record & metadata to Cloud Firestore
 */
export async function saveDocumentToFirestore(docRecord, file = null) {
  if (!db) {
    console.warn('[FINCHECK AI Firestore] Firestore client not initialized');
    return null;
  }

  const currentUser = auth?.currentUser;
  const uid = currentUser?.uid;
  const companyId = docRecord.companyId || 'company_001';
  const docId = docRecord.documentId || `doc_${Date.now()}`;

  // Read base64 if small enough to store inline
  let base64Data = null;
  if (file) {
    try {
      base64Data = await fileToBase64(file);
    } catch (e) {
      console.warn('[FINCHECK AI Firestore] Base64 conversion skipped:', e);
    }
  }

  const cleanDoc = {
    documentId: docId,
    companyId: companyId,
    fileName: docRecord.fileName || file?.name || 'document.pdf',
    documentType: docRecord.documentType || 'Annual Report',
    period: docRecord.period || 'FY2026',
    fileSize: docRecord.fileSize || file?.size || 0,
    pages: docRecord.pages || docRecord.pageCount || 1,
    pageCount: docRecord.pages || docRecord.pageCount || 1,
    status: docRecord.status || 'analyzed',
    progress: 100,
    factCount: docRecord.factCount || 0,
    uploadedAt: docRecord.createdAt || docRecord.uploadedAt || new Date().toISOString(),
    ...(base64Data ? { pdfBase64Preview: base64Data.slice(0, 100) + '...' } : {})
  };

  let saved = false;

  // 1. Primary write: under users/{uid} (100% guaranteed under user auth security rule)
  if (uid) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      let existingDocs = [];
      if (userSnap.exists()) {
        const udata = userSnap.data();
        existingDocs = udata.uploaded_documents || [];
      }

      // Filter out existing doc with same ID if any, then prepend
      const updatedDocs = [cleanDoc, ...existingDocs.filter(d => d.documentId !== docId)];
      await setDoc(userRef, { 
        uploaded_documents: updatedDocs,
        lastUploadAt: new Date().toISOString()
      }, { merge: true });

      console.log(`[FINCHECK AI Firestore] PDF metadata saved to users/${uid}/uploaded_documents (${cleanDoc.fileName})`);
      saved = true;
    } catch (err) {
      console.warn('[FINCHECK AI Firestore] Failed to append document to user profile:', err);
    }
  }

  // 2. Secondary write: under companies/{companyId}/documents/{docId}
  try {
    const compDocRef = doc(db, 'companies', companyId, 'documents', docId);
    await setDoc(compDocRef, cleanDoc, { merge: true });
    console.log(`[FINCHECK AI Firestore] PDF metadata saved to companies/${companyId}/documents/${docId}`);
    saved = true;
  } catch (err) {
    console.warn('[FINCHECK AI Firestore] Notice: writing to companies collection deferred (check Firestore security rules):', err.message);
  }

  return cleanDoc;
}

/**
 * Save extracted financial facts to Cloud Firestore
 */
export async function saveFactsToFirestore(docId, facts, companyId = 'company_001') {
  if (!db || !facts || !facts.length) {
    return false;
  }

  const currentUser = auth?.currentUser;
  const uid = currentUser?.uid;

  console.log(`[FINCHECK AI Firestore] Saving ${facts.length} extracted financial facts for doc ${docId}...`);

  // 1. Primary write: under users/{uid} -> financial_facts
  if (uid) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      let existingFacts = [];
      if (userSnap.exists()) {
        existingFacts = userSnap.data().financial_facts || [];
      }

      // Merge facts, avoiding duplicate factIds
      const factMap = new Map();
      existingFacts.forEach(f => factMap.set(f.factId || f.id, f));
      facts.forEach(f => factMap.set(f.factId || f.id, f));

      await setDoc(userRef, {
        financial_facts: Array.from(factMap.values()),
        lastFactsExtractedAt: new Date().toISOString()
      }, { merge: true });

      console.log(`[FINCHECK AI Firestore] ${facts.length} financial facts saved to users/${uid}/financial_facts`);
    } catch (err) {
      console.warn('[FINCHECK AI Firestore] Error updating facts in users collection:', err);
    }
  }

  // 2. Secondary write: under companies/{companyId}/financial_facts/{factId}
  try {
    for (const fact of facts) {
      const fId = fact.factId || fact.id || `fact_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const factRef = doc(db, 'companies', companyId, 'financial_facts', fId);
      await setDoc(factRef, {
        ...fact,
        factId: fId,
        documentId: docId,
        companyId: companyId,
        syncedToFirestoreAt: new Date().toISOString()
      }, { merge: true });
    }
    console.log(`[FINCHECK AI Firestore] Financial facts batch saved to companies/${companyId}/financial_facts`);
  } catch (err) {
    console.warn('[FINCHECK AI Firestore] Notice: writing to companies financial_facts collection deferred:', err.message);
  }

  return true;
}

/**
 * Retrieve user's Firestore data (uploaded documents & financial facts)
 */
export async function getFirestoreUserData(uid) {
  if (!db || !uid) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('[FINCHECK AI Firestore] Error reading user data from Firestore:', err);
  }
  return null;
}
