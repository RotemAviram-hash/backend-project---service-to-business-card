import fs from "fs";
import path from "path";

const logErrorToFile = (statusCode, message) => {
  // רושמים לוגים רק עבור שגיאות 400 ומעלה
  if (statusCode < 400) return;

  const logsDir = path.join(process.cwd(), "logs");

  // יצירת תיקיית logs במידה והיא לא קיימת
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const today = new Date().toISOString().split("T")[0]; // פורמט: YYYY-MM-DD
  const logFilePath = path.join(logsDir, `${today}.log`);

  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] STATUS: ${statusCode} | ERROR: ${message}\n`;

  // הוספת השורה לקובץ (אם הקובץ לא קיים - fs.appendFileSync ייצור אותו)
  fs.appendFileSync(logFilePath, logMessage, "utf8");
};

export default logErrorToFile;
