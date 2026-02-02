import express from "express";
import { Request, Response } from "express";
const app = express();
app.get("/", (req: Request, res: Response) => {
  res.send("this is homepage");
});
app.listen(4000, () => {
  console.log("server is running in port 4000");
});
