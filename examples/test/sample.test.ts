describe("Sample", () => {
	it("works", () => {
		expect(1 + 1).toBe(2);
	});

	it("checks string concatenation", () => {
		const result = "Hello" + " " + "World";
		expect(result).toBe("Hello World");
	});

	it("validates array includes", () => {
		const arr = [1, 2, 3];
		expect(arr).toContain(2);
	});
});
