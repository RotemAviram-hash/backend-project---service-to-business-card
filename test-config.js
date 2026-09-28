import dotenv from "dotenv";

dotenv.config();

console.log("ENV:", process.env.NODE_ENV);

const { default: config } = await import("config");

console.log("CONFIG ENV:", config.util.getEnv("NODE_ENV"));
console.log("CONFIG:", config);
console.log("NODE_CONFIG_ENV:", process.env.NODE_CONFIG_ENV);
console.log("NODE_CONFIG_DIR:", process.env.NODE_CONFIG_DIR);
console.log(config.util.getConfigSources());
