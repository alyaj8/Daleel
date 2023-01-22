import {
  child,
  get,
  getDatabase,
  push,
  ref,
  set,
  update,
} from "firebase/database";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { auth, db } from "../config/firebase";

import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { getDataFromStorage } from "../util/Storage";

import { deleteDoc, setDoc } from "firebase/firestore";
import { REQUESTS } from "../config/Constant";

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

  const reference = ref(storage, `media/${Date.now()}-${fileName}`);

  const uploadTask = uploadBytesResumable(reference, file);

  let imageUrl = null;
  uploadTask.on("state_changed", (snapshot) => {
    let saveData = true;
    const progress =
      Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    if (progress == 100) {
      if (saveData) {
        saveData = false;
        getDownloadURL(reference).then((url) => {
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

/*
! chatlist
  - 1
    - 2 (roomId1, lastMsg) 1 to 2 
    - 3 (roomId2, lastMsg) 1 to 3
  - 2
    - 1 (roomId1, lastMsg) 2 to 1
    - 3 (roomId3, lastMsg) 2 to 3
  - 3
    - 1 (roomId2, lastMsg) 3 to 1
  
! chats
  - roomId1
    - messages  
  - roomId2
    - messages
  - roomId3
    - messages

! On send message from 1 to 2
  - go to chatlist/1/2
    * if exists:
      - get roomId1
      - go to chats/roomId1/messages
      - add message
      - update chatlist/1/2/lastMsg
      - update chatlist/2/1/lastMsg
    
    * if not exists:
      - create chatlist/1/2
      - create chatlist/2/1
      - create chats/roomId1
      - go to chats/roomId1/messages
      - add message
      - update chatlist/1/2/lastMsg
      - update chatlist/2/1/lastMsg
! On Open chat list of 1
  - go to chatlist/1
    * if exists:
      - get all chatlist/1/*
    * if not exists:
      - create chatlist/1
      - get all chatlist/1/*
*/

export async function createChatRoom(senderId, receiverId) {
  try {
    const db = getDatabase();
    const fs = getFirestore();
    const dbRef = ref(db);

    const pathFromTo = `chatlist/${senderId}/${receiverId}`;
    const chatlist_FromTo_Get_Ref = child(dbRef, pathFromTo);
    const chatlist_FromTo_Set_Ref = ref(db, pathFromTo);

    const pathToFrom = `chatlist/${receiverId}/${senderId}`;
    const chatlist_ToFrom_Set_Ref = ref(db, pathToFrom);

    const createRoom = async () => {
      const roomId = uuidv4();
      const msgId = uuidv4();
      const lastMsg = "Chat room created";
      const chats_Set_Ref = ref(db, `chats/${roomId}/${msgId}`);

      // get sender data from firestore
      const senderData = await getDoc(doc(fs, "users", senderId));
      const senderVal = senderData.data();

      // get receiver data from firestore
      const receiverData = await getDoc(doc(fs, "users", receiverId));
      const receiverVal = receiverData.data();

      const senderData = {
        name: senderVal.firstName,

        roomId,
        lastMsg,
        senderId,
      };
      const receiverData = {
        name: receiverVal.firstName,
        roomId,
        lastMsg,
        senderId: receiverId,
      };

      await set(chatlist_FromTo_Set_Ref, senderData);
      await set(chatlist_ToFrom_Set_Ref, receiverData);

      await set(chats_Set_Ref, {
        roomId,
        id: msgId,
        type: "sys",
        content: "Chat room created",
        createdAt: new Date().getTime(),
      });

      // console.log("✅ roomId", roomId);
      return roomId;
    };

    const chatlistSnap = await get(chatlist_FromTo_Get_Ref);
    const chatlistVal = chatlistSnap.val();
    if (chatlistVal) {
      // return chatlistVal as roomId
      console.log("✅ chatlistVal", chatlistVal);
      return chatlistVal.roomId;
    }
    if (!chatlistVal) {
      console.log("❌ chatlistVal");
      // create room
      const roomId = await createRoom();
      console.log("✅ roomId", roomId);
      return roomId;
    }
  } catch (error) {
    console.log("❌ API > createChatRoom", error);
  }
}

export async function sendMessage(roomId, message, senderId, receiverId) {
  try {
    const db = getDatabase();
    const dbGetRef = ref(db);
    const chatPath = `chats/${roomId}`;
    const chat_Set_Ref = ref(db, chatPath);
    const chat_Get_Ref = child(dbGetRef, chatPath);

    const chatlist_FromTo_Set_Ref = ref(
      db,
      `chatlist/${senderId}/${receiverId}`
    );
    const chatlist_ToFrom_Set_Ref = ref(
      db,
      `chatlist/${receiverId}/${senderId}`
    );

    // a message entry.
    const msg = {
      roomId,
      type: "text",
      content: message,
      createdAt: new Date(),
      id: uuidv4(),
      from: senderId,
      to: receiverId,
    };
    // - update chatlist/from/to/lastMsg
    const senderData = {
      roomId,
      senderId,
      lastMsg: message,
    };
    // - update chatlist/to/from/lastMsg
    const receiverData = {
      roomId,
      senderId: receiverId,
      lastMsg: message,
    };

    // Get a key for a new message.
    const newMsgKey = push(chat_Set_Ref).key;
    console.log("🚀 ~ newMsgKey", newMsgKey);

    // Write the new message's data simultaneously in the chat list and the last's message list.
    const updates = {};
    updates[`${chatPath}/${newMsgKey}`] = msg;

    console.log("🚀 ~ updates", updates);
    console.log("🚀 ~ dbGetRef", dbGetRef);

    await update(dbGetRef, updates);

    await set(chatlist_FromTo_Set_Ref, senderData);

    await set(chatlist_ToFrom_Set_Ref, receiverData);

    console.log("✅ sendMessage");
    return true;
  } catch (error) {
    console.log("error", error);
    alert("sendMessage", error);
  }
}

export async function getChatList(userId) {
  try {
    const db = getDatabase();
    const dbRef = ref(db);
    const chatlist_Ref = child(dbRef, `chatlist/${userId}`);
    const chatlistSnap = await get(chatlist_Ref);
    const chatlistVal = chatlistSnap.val();
    console.log("✅ chatlistVal", chatlistVal);
    return chatlistVal;
  } catch (error) {
    console.log("❌ API > getChatList", error);
  }
}

export async function getChatMessages(roomId) {
  try {
    const db = getDatabase();
    const dbRef = ref(db);
    const chat_Ref = child(dbRef, `chats/${roomId}`);
    const chatSnap = await get(chat_Ref);
    const chatVal = chatSnap.val();
    console.log("✅ chatVal", chatVal);
    return chatVal;
  } catch (error) {
    console.log("❌ API > getChatMessages", error);
  }
}
