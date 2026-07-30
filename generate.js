import { createLicense } from "./database.js";

const key = createLicense("Customer", 30);

console.log("License:", key);