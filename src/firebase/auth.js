export function getAuth(app) {
  return { app };
}

export function onAuthStateChanged(auth, callback) {
  callback(null);
  return () => {};
}

export async function signInWithEmailAndPassword() {
  throw new Error('Firebase SDK is missing. Run npm install (or npm install firebase) and restart the dev server.');
}

export async function signOut() {
  return undefined;
}
