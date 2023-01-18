export function getRequestStatus(status) {
  if (status === 0) {
    return "قيد الانتظار";
  }
  if (status === 1) {
    return "قبول";
  }
}
export function getConversationId(currentUserId, chatUserId) {

  if (currentUserId < chatUserId) {
    return currentUserId + '_' + chatUserId;
  } else {
    return chatUserId + '_' + currentUserId;
  }
}