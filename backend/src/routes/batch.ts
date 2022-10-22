import { Router } from "express";
import authenticator from "../middleware/auth/authenticator";
import {
  createBatch,
  deleteBatch,
  getBatch,
  updateBatch,
} from "../controllers/batch-controller";

const batchRouter = Router();

batchRouter.get("/batch", authenticator(), getBatch); //?sort=ASC&page=2
batchRouter.get("/batch/:id", authenticator(), getBatch); // get all batches for a given farm id
batchRouter.post("/batch/create", authenticator(), createBatch);
batchRouter.patch("/batch/:id", authenticator(), updateBatch);
batchRouter.delete("/batch/:id", authenticator(), deleteBatch);

export default batchRouter;
