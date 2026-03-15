import express from "express";
import {
  getProjects,
  createProject,
  getMembers,
  addMember,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { inviteUser, acceptInvite, declineInvite } from "../controllers/project-invite.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getProjects);
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.get("/:projectId/members", protect, getMembers);
router.post("/:projectId/members", protect, addMember);


router.post("/:projectId/invite-link", protect, inviteUser);
router.post("/invites/:token/accept", protect, acceptInvite);
router.post("/invites/:token/decline", protect, declineInvite);

export default router;