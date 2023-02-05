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

      return {
        ...userDoc.data(),
        uid: localUid,
      };
    } else {
      const docRef = doc(db, "users", uid);
      const userDoc = await getDoc(docRef);
      // console.log("🚀 ~getUserObj> Remote", userDoc.data());
      return {
        ...userDoc.data(),
        uid: uid,
      };
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
    await updateDoc(taskDocRef, data);

    //TODO: if no image is provided, dont update the image
    if (data?.imageUrl || data?.title) {
      const dataToUpdate = {};
      if (data?.imageUrl) {
        dataToUpdate.imageUrl = data.imageUrl;
      }
      if (data?.title) {
        dataToUpdate.title = data.title;
      }

      // TODO: update all related requests
      const q = query(collection(db, "requests"), where("tourId", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        // doc.data() is never undefined for query doc snapshots
        await updateRequest(doc.id, dataToUpdate);
      });
    }
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

export async function acceptRequest(reqId, tourId, touristId) {
  try {
    // TODO: update the request status to accepted
    updateRequest(reqId, {
      acceptedAt: new Date(),
      bookedBy: touristId,
      status: 1,
    });

    // TODO: update the tour status to accepted
    const taskDocRef = doc(db, "tours", tourId);
    const result = await updateDoc(taskDocRef, {
      status: 1,
      acceptedAt: new Date(),
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

export async function rejectRequest(reqId) {
  try {
    // TODO: update the request status to rejected
    updateRequest(reqId, {
      status: 2,
      rejectedAt: new Date(),
    });
  } catch (err) {}
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
        isDeleted: true,
        rejectedAt: new Date(),
      });
    });
    return true;
  } catch (err) {
    console.log("🚀 ~ deleteTours err", err);
    alert(err);
  }
}

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

// get user object from firestore
export async function getUser(userId) {
  const db = getFirestore();
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  } else {
    console.log("No such document!");
  }
}

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
      try {
        const roomId = uuidv4();
        const msgId = uuidv4();
        const lastMsg = "Chat room created";
        const chats_Set_Ref = ref(db, `chats/${roomId}/${msgId}`);

        // get sender data from firestore
        const senderVal = await getUser(senderId);

        // get receiver data from firestore
        const receiverVal = await getUser(receiverId);

        const chatOnSenderList = {
          name: receiverVal.firstname,
          roomId,
          lastMsg,
          senderId: receiverId,
          createdAt: new Date().getTime(),
          isRead: false,
        };
        console.log("🚀 ~ chatOnSenderList", chatOnSenderList);

        const chatOnReceiverList = {
          name: senderVal.firstname,
          roomId,
          lastMsg,
          senderId,
          createdAt: new Date().getTime(),
          isRead: false,
        };
        console.log("🚀 ~ chatOnReceiverList", chatOnReceiverList);

        console.log("✅ Got users data");

        await set(chatlist_FromTo_Set_Ref, chatOnSenderList);
        await set(cghatlist_ToFrom_Set_Ref, chatOnReceiverList);

        await set(chats_Set_Ref, {
          roomId,
          id: msgId,
          type: "sys",
          content: "Chat room created",
          createdAt: new Date().getTime(),
        });

        console.log("✅ Created", roomId);

        return chatOnSenderList;
      } catch (error) {
        console.log("❌ API > createRoom", error);
      }
    };

    const chatlistSnap = await get(chatlist_FromTo_Get_Ref);
    const chatlistVal = chatlistSnap.val();

    if (chatlistVal) {
      // return chatlistVal as roomId
      console.log("✅ chatlistVal", chatlistVal);
      return chatlistVal;
    }

    if (!chatlistVal) {
      console.log("Room not exist, we will create a new one ❌ ");

      // create room
      const roomId = await createRoom();
      console.log("✅ roomId", roomId);
      return roomId;
    }
  } catch (error) {
    console.log("❌ API > createChatRoom", error);
  }
}

export async function sendMessage(roomId, message, sender, receiver) {
  const { senderId, senderName } = sender;
  const { receiverId, receiverName } = receiver;

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
      createdAt: new Date().getTime(),
      id: uuidv4(),
      from: senderId,
      senderName,
      to: receiverId,
    };
    // - update chatlist/from/to/lastMsg
    const chatOnSenderList = {
      name: receiverName,
      roomId,
      senderId: receiverId,
      lastMsg: message,
      createdAt: new Date().getTime(),
      isRead: false,
    };
    // - update chatlist/to/from/lastMsg
    const chatOnReceiverList = {
      name: senderName,
      roomId,
      senderId,
      lastMsg: message,
      createdAt: new Date().getTime(),
      isRead: false,
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

    await set(chatlist_FromTo_Set_Ref, chatOnSenderList);

    await set(chatlist_ToFrom_Set_Ref, chatOnReceiverList);

    console.log("✅ sendMessage");
    return true;
  } catch (error) {
    console.log("error", error);
    alert("sendMessage", error);
  }
}

// mark last message as read when user open chat room
export async function markAsRead(roomId, senderId, receiverId) {
  try {
    const db = getDatabase();
    const chatlist_FromTo_Set_Ref = ref(
      db,
      `chatlist/${senderId}/${receiverId}`
    );
    const chatlist_ToFrom_Set_Ref = ref(
      db,
      `chatlist/${receiverId}/${senderId}`
    );

    const chatOnSenderList = {
      isRead: true,
    };
    const chatOnReceiverList = {
      isRead: true,
    };

    await update(chatlist_FromTo_Set_Ref, chatOnSenderList);
    await update(chatlist_ToFrom_Set_Ref, chatOnReceiverList);

    console.log("✅ markAsRead");
    return true;
  } catch (error) {
    console.log("error", error);
    alert("markAsRead", error);
  }
}
