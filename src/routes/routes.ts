import { Express, Request, Response } from "express";

export default function (app: Express) {
    app.get('health-check')
}