function multiply(...nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((acc, n) => acc * Number(n), 1);
}

console.log("multiply(2,3,4) =", multiply(2, 3, 4));

async function run() {
  // Open visor only (do NOT set active tab)
  tfvis.visor().open();

  // Fetch users
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  const users = await res.json();

  // Transform: count users per city
  const cityCounts = {};
  for (const u of users) {
    const city = u?.address?.city ?? "Unknown";
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  }

  // Convert to tfjs-vis format
  const values = Object.entries(cityCounts).map(([city, count]) => ({
    x: city,
    y: count,
  }));

  // IMPORTANT: specify a tab name here (this creates the tab)
  tfvis.render.barchart(
    { name: "Users per City", tab: "Charts" },
    values,
    { xLabel: "City", yLabel: "Number of Users", height: 400 }
  );
}

document.addEventListener("DOMContentLoaded", run);
