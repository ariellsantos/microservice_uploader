export default interface Logger {
  debug(msg: string): void;
  error(msg: string | Error): void;
  info(msg: string): void;
}
