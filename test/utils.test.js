const { expect } = require('chai');
const { isTextPalindrome } = require('../app/helper/utils');

describe('isTextPalindrome', () => {
  it('should return true for an empty string', () => {
    expect(isTextPalindrome('')).to.be.true;
  });

  it('should return true for a single character string', () => {
    expect(isTextPalindrome('a')).to.be.true;
  });

  it('should return true for a palindrome string', () => {
    expect(isTextPalindrome('A man a plan a canal Panama')).to.be.true;
  });

  it('should return false for a non-palindrome string', () => {
    expect(isTextPalindrome('hello')).to.be.false;
  });

  it('should return true for a numeric palindrome', () => {
    expect(isTextPalindrome('12321')).to.be.true;
  });
});
