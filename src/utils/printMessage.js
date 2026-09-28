import chalk from "chalk";

const printMessage = (message, type = "info") => {
  switch (type) {
    case "success":
      console.log(chalk.green(message));
      break;

    case "error":
      console.error(chalk.red(message));
      break;

    case "warning":
      console.log(chalk.yellow(message));
      break;

    default:
      console.log(chalk.blue(message));
  }
};

export default printMessage;
