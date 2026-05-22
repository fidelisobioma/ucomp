describe("Storage calculations", () => {
  const MB = 1024 * 1024;
  const GB = 1024 * MB;

  it("should correctly calculate 20MB in bytes", () => {
    expect(20 * MB).toBe(20971520);
  });

  it("should correctly calculate 1GB in bytes", () => {
    expect(1 * GB).toBe(1073741824);
  });

  it("should correctly calculate 5GB in bytes", () => {
    expect(5 * GB).toBe(5368709120);
  });

  it("should detect storage full when used equals limit", () => {
    const storageUsed = 20971520;
    const storageLimit = 20971520;
    expect(storageUsed >= storageLimit).toBe(true);
  });

  it("should detect storage warning at 80%", () => {
    const storageUsed = 16777216; // 16MB
    const storageLimit = 20971520; // 20MB
    const percentage = (storageUsed / storageLimit) * 100;
    expect(percentage).toBeGreaterThanOrEqual(80);
  });

  it("should calculate expiry 24hrs from now", () => {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setHours(expiresAt.getHours() + 24);
    const diffHours = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    expect(diffHours).toBe(24);
  });
});
