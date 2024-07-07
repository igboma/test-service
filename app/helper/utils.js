/**
 * Check if a given text is a palindrome
 * @param {string} text - The text to check
 * @returns {boolean} - True if the text is a palindrome, false otherwise
 */
function isTextPalindrome(text) {
    text = text || "";
    const cleanedText = text.replace(/[^A-Za-z0-9]/g, "").toLowerCase(); // Remove all non-alphanumeric characters
    return cleanedText === cleanedText.split("").reverse().join("");
  }
  
  module.exports = {
    isTextPalindrome
  };
  