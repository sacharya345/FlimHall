import { config } from "dotenv";
import { fileURLToPath } from "node:url";

config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const { default: app } = await import("./app.js");

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters.');
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`FlimHall API running on port ${PORT}`);
});