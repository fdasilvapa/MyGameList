import { Router } from "express";
import { LibraryController } from "../controllers/library.controller";

const router = Router();

router.get("/", LibraryController.getLibrary);
router.post("/", LibraryController.addGame);
router.patch("/:id", LibraryController.updateStatus);

export default router;
