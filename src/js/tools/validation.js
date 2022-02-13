export default function validatePosition(positionString) {
  const str = positionString.trim();
  if (!str) {
    throw new Error('Поле должно быть заполнено');
  }

  const arr = str.split(',');
  if (arr.length < 2) {
    throw new Error('Нет запятой');
  }
  if (arr.length > 2) {
    throw new Error('Слишком много запятых');
  }

  let latitude = arr[0];
  let longitude = arr[1];

  if (latitude[0] === '[') {
    latitude = latitude.slice(1);
  }
  if (longitude[longitude.length - 1] === ']') {
    longitude = longitude.slice(0, -1);
  }

  latitude = +latitude;
  longitude = +longitude;

  if (Number.isNaN(latitude)) {
    throw new Error('Неправильный формат широты');
  }
  if (Number.isNaN(longitude)) {
    throw new Error('Неправильный формат долготы');
  }

  if ((latitude < -90) || (latitude > 90)) {
    throw new Error('Широта должна быть в диапазоне от -90 до 90');
  }
  if ((longitude < -180) || (longitude > 180)) {
    throw new Error('Долгота должна быть в диапазоне от -180 до 180');
  }

  return {
    coords: {
      latitude,
      longitude,
    },
    timestamp: Date.now(),
  };
}
