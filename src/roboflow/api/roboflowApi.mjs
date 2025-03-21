import roboflowHandler from "../usecase/roboflow.mjs"

import { Router } from "express"

const router = Router();

router.post("/roboflow", roboflowHandler);

export default router;




