import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { InsertAdmin } from "@shared/schema";

async function createAdminAccount(username: string, password: string) {
  try {
    // Check if admin already exists
    const existingAdmin = await storage.getAdminByUsername(username);
    if (existingAdmin) {
      console.log(`Admin with username "${username}" already exists.`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin account
    const adminData: InsertAdmin = {
      username,
      password: hashedPassword,
    };

    const admin = await storage.createAdmin(adminData);
    console.log(`Admin account created successfully with ID: ${admin.id}`);
  } catch (error) {
    console.error("Error creating admin account:", error);
  }
}

// Default credentials - you can change these or pass them as arguments
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

// Get username and password from command line arguments if provided
const username = process.argv[2] || DEFAULT_USERNAME;
const password = process.argv[3] || DEFAULT_PASSWORD;

createAdminAccount(username, password)
  .then(() => {
    console.log("Script completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  }); 