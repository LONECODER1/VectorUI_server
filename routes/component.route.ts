import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { generateComponent, getAllComponents, publishComponent, saveComponent } from "../controllers/component.controller.js";


const componentRouter = express.Router();

// AI generate component
componentRouter.post("/generate", isAuth, generateComponent);

// save component
componentRouter.post("/save", isAuth, saveComponent);

// publish component (admin only check controller में already है)
componentRouter.post("/publish", isAuth, publishComponent);

componentRouter.get("/all-components" , isAuth , getAllComponents)

export default componentRouter;