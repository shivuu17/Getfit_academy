export function getAuth(app) {
  return { app };
}

export function onAuthStateChanged(auth, callback) {
  callback(null);
  return () => {};
}

export async function signInWithEmailAndPassword() {
  throw new Error('Firebase auth is not available in this workspace.');
}

export async function signOut() {
  return undefined;
}
