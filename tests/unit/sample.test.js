describe('Sample Unit Test', () => {
  it('should return true for simple math', () => {
    expect(1 + 1).toBe(2);
  });

  it('should validate dummy logic', () => {
    const isEven = (n) => n % 2 === 0;
    expect(isEven(4)).toBe(true);
    expect(isEven(3)).toBe(false);
  });
});
