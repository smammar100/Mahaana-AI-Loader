declare module "gif.js" {
  interface GIF {
    on(event: "error", listener: (err: Error) => void): this
  }
}
