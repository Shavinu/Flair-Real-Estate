export const slice = (string, limit = 200) => {
  return string.length > limit
    ? string.slice(0, limit) + '...'
    : string;
}

export const isValidEmail = (email) => {
  const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return regex.test(email);
}

export const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || ""
