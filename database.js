import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const db = new Database("database.db");

db.exec(`
CREATE TABLE IF NOT EXISTS licenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_key TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    expires_at INTEGER NOT NULL,
    active INTEGER DEFAULT 1,
    device_id TEXT,
    created_at INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
);
`);

export function createLicense(customerName, days) {

    const key =
        "ROYAL-" +
        randomUUID()
            .replace(/-/g, "")
            .substring(0, 20)
            .toUpperCase();

    const expires =
        Math.floor(Date.now() / 1000) +
        days * 86400;

    db.prepare(`
        INSERT INTO licenses
        (license_key,customer_name,expires_at)
        VALUES (?,?,?)
    `).run(
        key,
        customerName,
        expires
    );

    return key;
}

export function validateLicense(key) {

    const row = db.prepare(`
        SELECT *
        FROM licenses
        WHERE license_key=?
    `).get(key);

    if (!row)
        return {
            valid: false,
            reason: "License not found"
        };

    if (!row.active)
        return {
            valid: false,
            reason: "License disabled"
        };

    if (row.expires_at < Math.floor(Date.now() / 1000))
        return {
            valid: false,
            reason: "License expired"
        };

    return {
        valid: true,
        license: row
    };
}

export function getLicenses() {

    return db.prepare(`
        SELECT *
        FROM licenses
        ORDER BY id DESC
    `).all();

}

export function disableLicense(id) {

    db.prepare(`
        UPDATE licenses
        SET active=0
        WHERE id=?
    `).run(id);

}

// إنشاء أول مفتاح اشتراك
const licenseCount = db.prepare(
    "SELECT COUNT(*) AS total FROM licenses"
).get();

if (licenseCount.total === 0) {

    const firstKey = createLicense("ADMIN", 3650);

    console.log("=================================");
    console.log("FIRST LICENSE:");
    console.log(firstKey);
    console.log("=================================");

}

// إنشاء أول مدير
const adminCount = db.prepare(
    "SELECT COUNT(*) AS total FROM admins"
).get();

if (adminCount.total === 0) {

    const hash = bcrypt.hashSync("admin123", 10);

    db.prepare(`
        INSERT INTO admins (username, password)
        VALUES (?, ?)
    `).run("admin", hash);

    console.log("=================================");
    console.log("ADMIN CREATED");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("=================================");

}

export default db;