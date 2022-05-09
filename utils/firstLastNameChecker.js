const checkFirstLastName = (password) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  
    if (
      password.match(/[0-9]/g) ||
      specialChars.test(password) ||
      password.includes(" ") || password.length<5
    ) {
      return false;
    } else {
      return true;
    }
  };
  
  module.exports = checkFirstLastName;
  