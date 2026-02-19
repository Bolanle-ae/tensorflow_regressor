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
  tfvis.visor().open();

  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  const users = await res.json();

  // 1) Users per City (Bar)
  const cityCounts = countBy(users, (u) => u?.address?.city);
  const cityBar = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([city, count]) => ({ index: city, value: count }));

  tfvis.render.barchart(
    { name: "Users per City (Bar)", tab: "Charts" },
    cityBar,
    { xLabel: "City", yLabel: "Users", height: 400 }
  );

  // 2) Users per Company (Bar)
  const companyCounts = countBy(users, (u) => u?.company?.name);
  const companyBar = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([company, count]) => ({ index: company, value: count }));

  tfvis.render.barchart(
    { name: "Users per Company (Bar)", tab: "Charts" },
    companyBar,
    { xLabel: "Company", yLabel: "Users", height: 450 }
  );

  // 3) Histogram: length of user names
  const nameLengths = users
    .map((u) => (u?.name ? u.name.length : NaN))
    .filter((n) => Number.isFinite(n));

  tfvis.render.histogram(
    { name: "Histogram: Name Lengths", tab: "Charts" },
    nameLengths,
    { maxBins: 10, height: 350 }
  );

  // 4) Line chart: City counts (sorted) as a simple trend
  // (Linechart expects {values: [{x,y}...]})
  const cityLineValues = Object.entries(cityCounts)
    .sort((a, b) => a[0].localeCompare(b[0])) // alphabetical by city
    .map(([city, count]) => ({ x: city, y: count }));

  tfvis.render.linechart(
    { name: "Users per City (Line)", tab: "Charts" },
    { values: cityLineValues },
    { xLabel: "City", yLabel: "Users", height: 400 }
  );

  // Optional: show data table (nice extra)
  tfvis.render.table(
    { name: "Users Table", tab: "Data" },
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
