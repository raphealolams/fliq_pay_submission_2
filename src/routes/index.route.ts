import { usersRoutes } from "./users.route";
import { TicketsRoutes } from "./tickets.route";

export default function (app: any) {
  app.use("/", TicketsRoutes);
  app.use("/", usersRoutes);
}
