export const CalculatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);

  // Assign scores based on different criteria
  const lengthScore = Math.min(password.length / minLength, 1);
  const uppercaseScore = hasUppercase ? 1 : 0;
  const lowercaseScore = hasLowercase ? 1 : 0;
  const numberScore = hasNumber ? 1 : 0;
  const symbolScore = hasSymbol ? 1 : 0;

  // Calculate the overall strength as the average of individual scores
  const overallStrength =
    lengthScore + uppercaseScore + lowercaseScore + numberScore + symbolScore;

  return { overallStrength };
};

export const GetCalculatePasswordStrengthByNumber = (overallStrength) => {
  switch (overallStrength) {
    case 1:
      return {
        strength_1: true,
        strength_2: false,
        strength_3: false,
        strength_4: false,
        strength_5: false,
      };
    case 2:
      return {
        strength_1: false,
        strength_2: true,
        strength_3: false,
        strength_4: false,
        strength_5: false,
      };
    case 3:
      return {
        strength_1: false,
        strength_2: false,
        strength_3: true,
        strength_4: false,
        strength_5: false,
      };
    case 4:
      return {
        strength_1: false,
        strength_2: false,
        strength_3: false,
        strength_4: true,
        strength_5: false,
      };
    case 5:
      return {
        strength_1: false,
        strength_2: false,
        strength_3: false,
        strength_4: false,
        strength_5: true,
      };
    default:
      return {
        strength_1: false,
        strength_2: false,
        strength_3: false,
        strength_4: false,
        strength_5: false,
      };
  }
};
