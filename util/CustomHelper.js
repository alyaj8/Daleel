export function getRequestStatus(status) {
  if (status === 0) {
    return "قيد الانتظار";
  }
  if (status === 1) {
    return "قبول";
  }
}
