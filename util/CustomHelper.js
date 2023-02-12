export function getRequestStatus(status) {
  if (status === 0) {
    return "قيد الانتظار";
  }
  if (status === 1) {
    return "";
  }
}
export function getConversationId(currentUserId, chatUserId) {
  if (currentUserId < chatUserId) {
    return currentUserId + "_" + chatUserId;
  } else {
    return chatUserId + "_" + currentUserId;
  }
}

export function splitString(
  string,

  {
    separator = ",",
    limit = 0,
    removeEmpty = true,
    trim = true,
    convertToLowerCase = false,
    capitalizeFirstLetter = false,
  }
) {
  let result = [];
  // if string is not provided
  if (!string) {
    // then return empty array
    return result;
  }

  // split string by separator
  result = string.split(separator);

  // if limit is provided and is greater than 0 and result length is greater than limit
  if (limit > 0 && result.length > limit) {
    // then slice result by limit
    result = result.slice(0, limit);
  }

  // Process result
  result = result.map((item) => {
    // if trim is true
    trim && (item = item.trim());

    // if convertToLowerCase is true
    convertToLowerCase && (item = item.toLowerCase());

    // if capitalizeFirstLetter is true
    capitalizeFirstLetter &&
      (item = item.charAt(0).toUpperCase() + item.slice(1));

    return item;
  });

  return result;
}
