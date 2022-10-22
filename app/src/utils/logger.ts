import chalk from "chalk";

export function log(message: string): void {
    const output = [chalk.gray(new Date().toLocaleTimeString()), chalk.green("[log]"), message, "\n"];

    process.stdout.write(output.join(" "));
}

export function error(message: string | Error): void {
    const erroutput = [chalk.gray(new Date().toLocaleTimeString()), chalk.red("[err]"), message instanceof Error ? `${message.name}\n\t${message.message}\n\t${message.stack}` : message, "\n"];

    process.stderr.write(erroutput.join(" "));
}
