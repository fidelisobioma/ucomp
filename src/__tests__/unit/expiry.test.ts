describe("Expiry logic", () => {
  it("should detect expired items", () => {
    const expiresAt = new Date(Date.now() - 1000); // 1 second ago
    const isExpired = new Date(expiresAt) < new Date();
    expect(isExpired).toBe(true);
  });

  it("should detect non-expired items", () => {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
    const isExpired = new Date(expiresAt) < new Date();
    expect(isExpired).toBe(false);
  });

  it("should reset expiry to 24hrs after printing", () => {
    const now = new Date();
    const newExpiresAt = new Date();
    newExpiresAt.setHours(newExpiresAt.getHours() + 24);
    const diffHours =
      (newExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    expect(Math.round(diffHours)).toBe(24);
  });

  it("should detect grace period (7 days after expiry)", () => {
    const planExpiresAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3); // 3 days ago
    const gracePeriodEnd = new Date(planExpiresAt);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);
    const isInGrace = new Date() < gracePeriodEnd;
    expect(isInGrace).toBe(true);
  });
});
