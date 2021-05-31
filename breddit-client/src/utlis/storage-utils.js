export const setInLocalStorage = (name, value) =>
  localStorage.setItem(name, value);

export const removeFromLocalStorage = (name, value) =>
  localStorage.removeItem(name, value);

export const isInLocalStorage = (name) =>
  localStorage.getItem(name) === null ? false : true;

export const getFromLocalStorage = (name) =>
  isInLocalStorage(name) ? localStorage.getItem(name) : undefined;
