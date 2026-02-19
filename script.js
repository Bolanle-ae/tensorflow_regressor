function multiply(...nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((acc, n) => acc * Number(n), 1);
}

console.log("multiply(2,3,4) =", multiply(2, 3, 4));

function countBy(items, getKey) {
  const counts = {};
  for (const item of items) {
    const key = getKey(item) ?? "Unknown";
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

async function run() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  const users = await res.json();

  // 1) Users per City (Bar) — barchart needs {index, value}
  const cityCounts = countBy(users, (u) => u?.address?.city);
  const cityBar = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([city, count]) => ({ index: city, value: count }));

  tfvis.render.barchart(
    document.getElementById("chart-city"),
    cityBar,
    { xLabel: "City", yLabel: "Users", height: 350 }
  );

  // 2) Users per Company (Bar)
  const companyCounts = countBy(users, (u) => u?.company?.name);
  const companyBar = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([company, count]) => ({ index: company, value: count }));

  tfvis.render.barchart(
    document.getElementById("chart-company"),
    companyBar,
    { xLabel: "Company", yLabel: "Users", height: 350 }
  );

  // 3) Histogram: name lengths
  const nameLengths = users
    .map((u) => (u?.name ? u.name.length : NaN))
    .filter((n) => Number.isFinite(n));

  tfvis.render.histogram(
    document.getElementById("chart-hist"),
    nameLengths,
    { maxBins: 10, height: 350 }
  );

  // 4) Line chart: city counts (sorted alphabetically) — linechart uses {values:[{x,y}]}
  const cityLineValues = Object.entries(cityCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([city, count]) => ({ x: city, y: count }));

  tfvis.render.linechart(
    document.getElementById("chart-line"),
    { values: cityLineValues },
    { xLabel: "City", yLabel: "Users", height: 350 }
  );

  // 5) Table of users
  tfvis.render.table(
    document.getElementById("table-users"),
    {
      headers: ["id", "name", "email", "city", "company"],
      values: users.map((u) => [
        u.id,
        u.name,
        u.email,
        u?.address?.city ?? "Unknown",
        u?.company?.name ?? "Unknown",
      ]),
    }
  );
}

document.addEventListener("DOMContentLoaded", run);
