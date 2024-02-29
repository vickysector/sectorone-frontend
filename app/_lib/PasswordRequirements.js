export const CheckPasswordRequirements = (password) => {
  const minLength = 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
  const isLengthValid = password.length >= minLength;

  return { passwordRequirement: isLengthValid && hasNumberOrSymbol };
};
