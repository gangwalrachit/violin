const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src", "data.json");

function readABCFiles(dir, category) {
  const fullDir = path.join(ROOT, dir);
  if (!fs.existsSync(fullDir)) return [];

  return fs
    .readdirSync(fullDir)
    .filter((f) => f.endsWith(".abc"))
    .map((f) => {
      const abc = fs.readFileSync(path.join(fullDir, f), "utf8").trim();
      const titleMatch = abc.match(/^T:\s*(.+)$/m);
      return {
        id: f.replace(".abc", ""),
        title: titleMatch ? titleMatch[1].trim() : f.replace(".abc", ""),
        category,
        abc,
      };
    })
    .sort((a, b) => {
      const numA = parseInt(a.id.match(/\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.id.match(/\d+/)?.[0] || "0", 10);
      if (numA !== numB) return numA - numB;
      return a.id.localeCompare(b.id);
    });
}

const data = {
  exercises: readABCFiles("exercises", "exercises"),
  songs: readABCFiles("songs", "songs"),
};

fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Generated ${OUT} — ${data.exercises.length} exercises, ${data.songs.length} songs`
);
