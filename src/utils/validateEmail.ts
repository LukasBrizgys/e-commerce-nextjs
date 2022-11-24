const isValidEmail = (email : string) => {
    const regex : RegExp = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  export default isValidEmail;