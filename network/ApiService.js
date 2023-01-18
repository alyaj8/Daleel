import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { getDataFromStorage } from "../util/Storage";

import { deleteDoc, setDoc } from "firebase/firestore";
import { CHATS_TABLE, REQUESTS } from "../config/Constant";

export async function getUserId() {
  let uid = auth?.currentUser?.uid;
  // console.log("🚀 ~ auth uid", uid);
  if (!uid) {
    // get user id from local storage
    const localUid = await getDataFromStorage("loggedInUser");
    // console.log("🚀 ~ local Uid", localUid.uid);
    return localUid.uid;
  } else {
    return uid;
  }
}

export async function getUserObj() {
  try {
    let uid = auth?.currentUser?.uid;
    // console.log("🚀 ~getUserObj> uid", uid);

    if (!uid) {
      // get user id from local storage
      const localUid = await getDataFromStorage("loggedInUser");

      const docRef = doc(db, "users", localUid);
      const userDoc = await getDoc(docRef);
      // console.log("🚀 ~getUserObj> Local", userDoc.data());

      return userDoc.data();
    } else {
      const docRef = doc(db, "users", uid);
      const userDoc = await getDoc(docRef);
      // console.log("🚀 ~getUserObj> Remote", userDoc.data());
      return userDoc.data();
    }
  } catch (err) {
    alert(err);
  }
}

export async function insertTour(data) {
  try {
    const result = await addDoc(collection(db, "tours"), data);
    // console.log("insertTour", result);
  } catch (err) {
    console.log("insertRequest", err);
    alert(err);
  }
}

export async function insertRequest(data) {
  try {
    const result = await addDoc(collection(db, "requests"), data);
    // console.log("insertRequest", result);
  } catch (err) {
    console.log("insertRequest", err);
    alert(err);
  }
}

export async function updateTour(id, data) {
  try {
    const taskDocRef = doc(db, "tours", id);
    const result = await updateDoc(taskDocRef, data);
    console.log("updateRequest >result ", result);
    return result;
  } catch (err) {
    console.log("🚀 ~updateRequest err", err);
    alert(err);
  }
}
export async function updateRequest(reqId, data) {
  try {
    const taskDocRef = doc(db, "requests", reqId);
    const result = await setDoc(taskDocRef, data, { merge: true });
    console.log("updateRequest >result ", result);

    return result;
  } catch (err) {
    console.log("🚀 ~ updateStatus err", err);

    alert(err);
  }
}

export async function acceptRequest(reqId, tourId) {
  try {
    // TODO: update the request status to accepted
    updateRequest(reqId, {
      acceptedAt: new Date(),
      status: 1,
    });

    // TODO: Update all other requests of the same tour to rejected
    const q = query(collection(db, "requests"), where("tourId", "==", tourId));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      // TODO: Dont update the current request
      if (doc.id !== reqId) {
        // doc.data() is never undefined for query doc snapshots
        const result = await updateRequest(doc.id, {
          status: 2,
          rejectedAt: new Date(),
        });
      }
    });
    return true;
  } catch (err) {
    console.log("🚀 ~ acceptRequest err", err);

    alert(err);
  }
}

export async function deleteRequest(id) {
  const taskDocRef = doc(db, REQUESTS, id);
  try {
    const result = await deleteDoc(taskDocRef);
    console.log("result", result);
    return true;
  } catch (err) {
    alert(err);
  }
}

export async function deleteTour(id) {
  try {
    // TODO: delete the tour from tours collection
    const taskDocRef = doc(db, "tours", id);
    const deletedTour = await deleteDoc(taskDocRef);
    console.log("result", deletedTour);

    // TODO: rename all related reqs in requests collection
    const q = query(collection(db, "requests"), where("tourId", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      const renamedReq = await updateRequest(doc.id, {
        title: "محذوف",
        status: 2,
        rejectedAt: new Date(),
      });
    });
    return true;
  } catch (err) {
    console.log("🚀 ~ deleteTours err", err);
    alert(err);
  }
}

// export async function upload(path) {
//   const uri = Platform.OS === "ios" ? path.replace("file://", "") : path;
//   const fileName = uri.substring(uri.lastIndexOf("/") + 1);
//   const storage = getStorage();
//   const response = await fetch(uri);
//   const file = await response.blob();

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
export async function insertMessage(daa, cotnversationId) {
  try {
    const docRef = doc(db, CHATS_TABLE, conversationId);
    const colRef = collection(docRef, "messages");
    addDoc(colRef, data);
    // setDoc(doc(db, CHATS_TABLE, conversationId), data);
  } catch (err) {
    alert("insertMessage", err);
  }
}

export async function createChatRoom(data, userId1, userId2) {
  try {
    console.log("userId1", userId1);
    console.log("userId2", userId2);
    // const docRef = doc(db, "chat_threads", userId1);
    // const colRef = collection(docRef, "threads/" + userId2);
    // setDoc(colRef, data);

    setDoc(doc(db, "users", userId1, "chat_threads", userId2), data);
  } catch (err) {
    console.log("error", err);
    alert("createChatRoom", err);
  }
}
