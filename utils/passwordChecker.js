const checkPassword = (password) => {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (
    !password.match(/[a-z]/g) ||
    !password.match(/[A-Z]/g) ||
    !password.match(/[0-9]/g) ||
    specialChars.test(password) ||
    password.includes(" ") || password.length<5
  ) {
    return false;
  } else {
    return true;
  }
};

module.exports = checkPassword;
