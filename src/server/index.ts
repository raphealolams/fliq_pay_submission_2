const start = (app: any, options: any) =>
  new Promise((resolve, reject) => {
    const {
      log,
      express,
      http,
      config,
      routes: { usersRoutes },
      verifyJWT
    } = options;

    /**
     * @author basic middleware for req && res logging
     */
    app.use((req: any, res: any, next: any) => {
      log.info(
        `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
      );

      res.on("finish", () => {
        log.info(
          `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
        );
      });
      next();
    });

    app.use(verifyJWT);
    /**
     * @author parse the request been sent from the client
     */
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    /**
     * @author basic API rules
     */
    app.use((req: any, res: any, next: any) => {
      res.header("Content-Type", "application/json");
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
      );
      res.header("X-XSS-Protection", "1; mode=block");
      res.header("X-Frame-Options", "deny");
      res.header("X-Content-Type-Options", "nosniff");

      if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
        return res.status(200).json({});
      }
      next();
    });

    app.use("/", usersRoutes);

    /**
     * @author error handling
     */

    app.use((req: any, res: any, next: any) => {
      const error = new Error("not Found");

      return res.status(404).json({
        status: false,
        code: 404,
        message: error.message,
        data: {},
      });
    });

    /**
     * @author create a http server
     */
    const httpServer = http.createServer(app);
    const server = httpServer.listen(config.server.port, () => resolve(server));
  });

export { start as server };
