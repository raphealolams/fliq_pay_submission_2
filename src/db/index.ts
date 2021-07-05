import mongoose from "mongoose";
import log from "../logger";
let database: mongoose.Connection;

export const connect = (mediator: any, config: any) => {
  mediator.once("boot.ready", () => {
    if (database) {
      return;
    }
    mongoose.connect(config.url, config.options);
    database = mongoose.connection;

    database.once("open", (db) => {
      log.info("database connected");
      mediator.emit("db.ready", db);
    });
    database.on("error", (err) => {
      log.error("error connecting to database");
      mediator.emit("db.error", err);
    });
  });
};
export const disconnect = () => {
  if (!database) {
    return;
  }
  mongoose.disconnect();
};
