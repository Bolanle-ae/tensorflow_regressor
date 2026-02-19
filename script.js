function multiply(...nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((acc, n) => acc * Number(n), 1);
}

console.log("multiply(2,3,4) =", multiply(2, 3, 4));

async function run() {
  tfvis.visor().open();

  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  const users = await res.json();

  // Count users per city
  const cityCounts = {};
  for (const u of users) {
    const city = u?.address?.city ?? "Unknown";
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  }

  // ✅ barchart expects: [{ index: <label>, value: <number> }, ...]
  const barData = Object.entries(cityCounts).map(([city, count]) => ({
    index: city,
    value: count,
  }));

  console.log("barData:", barData);

  tfvis.render.barchart(
    { name: "Users per City", tab: "Charts" },
    barData,
    { xLabel: "City", yLabel: "Number of Users", height: 400 }
  );
}

document.addEventListener("DOMContentLoaded", run);
