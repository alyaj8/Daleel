const monthArray = [
  'Jan',
  'Feb',
  'March',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getFormattedDate(dateTime) {
  var date = new Date(dateTime);
  var year = date.getFullYear();
  var months = monthArray[date.getMonth()];
  var day = date.getDate();

  const formattedDate = months + ' ' + day + ', ' + year;
  return formattedDate;
}
export function getFormattedDateForGraph(dateTime) {
  var date = new Date(dateTime);
  var year = date.getFullYear();
  var months = monthArray[date.getMonth()];
  var day = date.getDate();

  const formattedDate = months + ' ' + day;
  return formattedDate;
}

export function getDateTime(dateTime) {
    
  var date = new Date(dateTime);
  var year = date.getFullYear();
  var months = monthArray[date.getMonth()];
  var day = date.getDate();
  var time = date.getTime();
  var updateTime = new Date(time);
  var hours = updateTime.getHours();
  var minutes = '0' + updateTime.getMinutes();
  var formattedTime = hours + ':' + minutes.substr(-2);
  const formattedDate =
    day + ' ' + months + ' ' + year + ' ' + formattedTime;
  return formattedDate;
}

export function getNumberOfDaysFromDates(futureDate) {

  const oneDay = 1000 * 60 * 60 * 24;
  var startDate = new Date().getTime();
var endDate   = new Date(futureDate).getTime();
const differenceMs = Math.abs(endDate - startDate);
const numberOfDays = Math.round(differenceMs / oneDay);
return Number(numberOfDays)

}


export function convertDateIntoSeconds(futureDate) {
 
  var startDate = new Date();
// Do your operations
var endDate   = new Date(futureDate);
var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
return Number(seconds)

}
export function convertUnixIntoTime(unixDate) {
  var date = unixDate * 1000;
  var time = new Date(date);

  var hours = time.getHours();
  var minutes = time.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var formattedTime = hours + ':' + minutes + '' + ampm;

  var month = time.getMonth() + 1;
  const formattedDate = time.getDate() + '/' + month + '/' + time.getFullYear();
  return formattedTime; //+ ' ' + formattedTime;
}
