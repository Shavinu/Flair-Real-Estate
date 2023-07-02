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

export const isValidMobile = (mobile) =>{
  mobile = mobile.replace(/-|\s/g, "");
  const regex = /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;

  return regex.test(mobile);
}

export const isValidPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+{}[\]|\\;:'",.<>/?]).{8,}$/;
  return regex.test(password);
}
