import {
  collection,
  query,
  where,
  getFirestore,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth } from "../config/firebase";
import { REQUEST_TABLE } from "../config/Constant";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const db = getFirestore();

export async function getUserId() {
  let uid = auth.currentUser.uid;
  return uid;
}

export async function getUserObj() {
  try {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(docRef);
    return userDoc.data();
  } catch (err) {
    alert(err);
  }
}

export async function insertRequest(data, table) {
  try {
    await addDoc(collection(db, table), data);
  } catch (err) {
    alert(err);
  }
}

export async function updateRequest(id, data) {
  console.log('id', id)
  console.log('data', data)

  const taskDocRef = doc(db, REQUEST_TABLE, id);
  try {
    await updateDoc(taskDocRef, data);
    return true
  } catch (err) {
    alert(err);
  }
}

export async function upload(path) {
  const uri = Platform.OS === "ios" ? path.replace("file://", "") : path;
  const fileName = uri.substring(uri.lastIndexOf("/") + 1);
  const storage = getStorage();
  const response = await fetch(uri);
  const file = await response.blob();

  const storageRef = ref(storage, `media/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  let imageUrl = null;
  uploadTask.on("state_changed", (snapshot) => {
    let saveData = true;
    const progress =
      Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    if (progress == 100) {
      if (saveData) {
        saveData = false;
        getDownloadURL(storageRef).then((url) => {
          imageUrl = url;
        });
      }
    }
  });
  try {
    await uploadTask;
    return imageUrl;
  } catch (e) {
    console.error(e);
  }
}
