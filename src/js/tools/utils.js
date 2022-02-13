import moment from 'moment';

export function coordsToString(coords) {
  const latitude = coords.latitude.toFixed(5);
  const longitude = coords.longitude.toFixed(5);
  return `[${latitude}, ${longitude}]`;
}

export function dateTimeToString(timestamp) {
  return moment(timestamp).format('DD.MM.YY HH:mm');
}

export function timer(timestamp) {
  return moment(moment().diff(timestamp)).format('mm:ss');
}
