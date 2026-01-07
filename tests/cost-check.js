
// Simple cost estimator mock
const currentUsage = 2.50; // Mock value, in real world fetch from API
const maxBudget = 5.00;

console.log(`Current estimated usage: $${currentUsage}`);
console.log(`Max budget: $${maxBudget}`);

if (currentUsage > maxBudget) {
    console.error("❌ COST LIMIT EXCEEDED. Aborting tests.");
    process.exit(1);
} else {
    console.log("✅ Budget check passed.");
    process.exit(0);
}
