import http from "http";
import express from "express";
import { EventEmitter } from "events";

import config from "./config";
import { connect, disconnect } from "./db/index";
import log from "./logger";
import { server } from "./server";
import { verifyJWT } from "./middleware/auth";
import routes from './routes/index.route'

const mediator = new EventEmitter();

const app = express();

/**
 * @author event listener when the repository has been connected
 */
mediator.on("db.ready", () => {
  return server(
    app,
    {
      log,
      express,
      http,
      config,
      verifyJWT,
      routes,
    },
  ).then((app: any) => {
    log.info(
      `Server started successfully, running on port: ${config.server.port}.`,
    );
    app.on("close", () => {
      disconnect();
    });
  });
});

/**
 * @author database error occurred
 */
mediator.on("db.error", (err) => {
  log.error(`Error connecting to Mongo DB ${err}`);
});

/**
 * @author we load the connection to the database
 */
connect(mediator, config.mongo);

/**
 * @author init the app, and the event listener will handle the rest
 */
mediator.emit("boot.ready");
