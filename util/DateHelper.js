const monthArray = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function getFormattedDate(dateTime) {
  // if date is firestore timestamp
  if (!!dateTime?.toDate) {
    dateTime = dateTime.toDate();
  }

  var date = new Date(dateTime);
  var year = date.getFullYear();
  var months = monthArray[date.getMonth()];
  var day = date.getDate();

  const formattedDate = months + " " + day + ", " + year;
  return formattedDate;
}

export function convertSecondsIntoTime(dateTime) {
  var date = new Date(dateTime);
  var time = date.getTime();
  var updateTime = new Date(time);
  var hours = updateTime.getHours();
  var minutes = "0" + updateTime.getMinutes();
  var formattedTime = hours + ":" + minutes.substr(-2);
  return formattedTime;
}

export function convertUnixIntoTime(unixDate) {
  var date = unixDate * 1000;
  var time = new Date(date);

  var hours = time.getHours();
  var minutes = time.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var formattedTime = hours + ":" + minutes + "" + ampm;

  var month = time.getMonth() + 1;
  const formattedDate = time.getDate() + "/" + month + "/" + time.getFullYear();
  return formattedTime; //+ ' ' + formattedTime;
}

export const getFormattedTime = (time, withSeconds = false) => {
  // if time is firestore timestamp
  if (!!time?.toDate) {
    time = time.toDate();
  }

  const date = new Date(time);

  // 24 hour format

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  // am or pm
  const ampm = hours >= 12 ? "PM" : "AM";

  // 12 hour format
  hours = hours % 12 || 12;

  // add 0 if minutes less than 10
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // add 0 if seconds less than 10
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // with seconds
  if (withSeconds) {
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  // without seconds
  return `${hours}:${minutes} ${ampm}`;
};

export const limitCharacters = (text, limit) => {
  // if text is empty
  if (!text) {
    return "";
  }

  // if text is less than limit
  if (text.length <= limit) {
    return text;
  }

  // if text is more than limit
  return text.substring(0, limit) + "...";
};

export const logObj = (obj, title = "") => {
  console.log(title, JSON.stringify(obj, null, 2));
};

// get date from {seconds, milliseconds}
export const getDateFromSeconds = (secondsAndNanoseconds, mode = "date") => {
  // convert nanoseconds to seconds
  const secondsFromNanoseconds = secondsAndNanoseconds.nanoseconds / 1000000000;
  // add seconds and nanoseconds
  const allSeconds = secondsAndNanoseconds.seconds + secondsFromNanoseconds;
  // convert seconds to date
  const date = new Date(allSeconds * 1000);
  const formattedDate = getFormattedDate(date);
  const formattedTime = getFormattedTime(date);

  if (mode === "date") {
    return formattedDate;
  } else if (mode === "time") {
    return formattedTime;
  }
};
