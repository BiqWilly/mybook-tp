export const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};

export const login = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("user");
};
