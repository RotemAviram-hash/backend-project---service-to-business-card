import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import config from "config";
import dotenv from "dotenv";

dotenv.config();
import User from "./src/models/Users.js";
import authService from "./src/services/authService.js";

const testEmail = "lockout-test@example.com";
const testPassword = "Test1234!";

let testUser;

before(async () => {
  // התחברות לאותו MongoDB שהפרויקט משתמש בו
  await mongoose.connect(config.get("mongoUri"));

  const hashedPassword = await bcrypt.hash(testPassword, 10);

  testUser = await User.create({
    name: {
      first: "Lockout",
      middle: "",
      last: "Test",
    },
    phone: "0501234567",
    email: testEmail,
    password: hashedPassword,
    address: {
      country: "Israel",
      city: "Test City",
      street: "Test Street",
      houseNumber: 1,
    },
    isAdmin: false,
    isBusiness: false,
  });
});

after(async () => {
  // מחיקת משתמש הבדיקה
  await User.deleteOne({ email: testEmail });

  await mongoose.connection.close();
});

test("login lockout after three failed attempts", async () => {
  // ניסיון שגוי ראשון
  await assert.rejects(authService.login(testEmail, "WrongPassword1"), {
    status: 401,
    message: "Invalid email or password",
  });

  let user = await User.findOne({ email: testEmail });

  assert.equal(user.failedLoginAttempts, 1);
  assert.equal(user.blockedUntil, null);

  // ניסיון שגוי שני
  await assert.rejects(authService.login(testEmail, "WrongPassword2"), {
    status: 401,
    message: "Invalid email or password",
  });

  user = await User.findOne({ email: testEmail });

  assert.equal(user.failedLoginAttempts, 2);
  assert.equal(user.blockedUntil, null);

  // ניסיון שגוי שלישי - אמור לחסום
  await assert.rejects(authService.login(testEmail, "WrongPassword3"), {
    status: 403,
    message: "Account is temporarily blocked",
  });

  user = await User.findOne({ email: testEmail });

  assert.equal(user.failedLoginAttempts, 3);
  assert.ok(user.blockedUntil instanceof Date);
  assert.ok(user.blockedUntil > new Date());

  const originalBlockedUntil = user.blockedUntil.getTime();

  // ניסיון נוסף בזמן החסימה
  await assert.rejects(authService.login(testEmail, testPassword), {
    status: 403,
    message: "Account is temporarily blocked",
  });

  user = await User.findOne({ email: testEmail });

  // החסימה לא הוארכה
  assert.equal(user.blockedUntil.getTime(), originalBlockedUntil);
  assert.equal(user.failedLoginAttempts, 3);

  // מדמים שהחסימה הסתיימה
  await User.updateOne(
    { email: testEmail },
    {
      blockedUntil: new Date(Date.now() - 1000),
    },
  );

  // עכשיו התחברות נכונה אמורה לעבוד
  const token = await authService.login(testEmail, testPassword);

  assert.equal(typeof token, "string");
  assert.ok(token.length > 0);

  // אחרי התחברות מוצלחת המונה אמור להתאפס
  user = await User.findOne({ email: testEmail });

  assert.equal(user.failedLoginAttempts, 0);
  assert.equal(user.blockedUntil, null);
});

test("successful login resets failed attempts", async () => {
  // יוצרים ניסיון כושל אחד
  await assert.rejects(authService.login(testEmail, "WrongPassword"), {
    status: 401,
    message: "Invalid email or password",
  });

  let user = await User.findOne({ email: testEmail });

  assert.equal(user.failedLoginAttempts, 1);

  // התחברות נכונה שוברת את הרצף
  const token = await authService.login(testEmail, testPassword);

  assert.equal(typeof token, "string");
  assert.ok(token.length > 0);

  user = await User.findOne({ email: testEmail });

  assert.equal(user.failedLoginAttempts, 0);
  assert.equal(user.blockedUntil, null);
});
