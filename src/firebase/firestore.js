export function getFirestore(app) {
  return { app };
}

export function collection(db, name) {
  return { db, name };
}

export async function getDocs() {
  return { docs: [], size: 0 };
}

export function doc(db, collectionName, id) {
  return { db, collectionName, id };
}

export async function updateDoc() {
  return undefined;
}

export async function deleteDoc() {
  return undefined;
}

export async function setDoc() {
  return undefined;
}

export async function addDoc() {
  return { id: `local-${Date.now()}` };
}
