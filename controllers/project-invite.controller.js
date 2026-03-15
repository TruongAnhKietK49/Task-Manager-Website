import ProjectInvite from "../models/project-invite.js";
import crypto from "crypto";

export const inviteUser = async (req, res) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const invite = await ProjectInvite.create({
      projectId: req.params.projectId,
      email: req.body.email,
      invitedBy: req.user.id,
      token: token,
    });

    await invite.save();
    const inviteLink = `${req.protocol}://${req.get("host")}/api/projects/invites/${invite._id}/accept?token=${token}`;

    res.status(201).json({ ...invite.toObject(), inviteLink });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptInvite = async (req, res) => {
  const invite = await ProjectInvite.findOne({
    token: req.params.token,
  }).populate("projectId");

  if (!invite) {
    return res.status(404).json({ message: "Invalid invite link" });
  }

  if (invite.status !== "pending") {
    return res.status(400).json({ message: "Invite is not pending" });
  }

  if (invite.email !== req.user.email) {
    return res.status(403).json({ message: "This invite is not for your email" }); 
  }

  invite.status = "accepted";
  await invite.save();

  await Project.findByIdAndUpdate(invite.projectId, {
    $addToSet: { members: req.user.id },
  });

  res.json({ message: "Joined project" });
};

export const declineInvite = async (req, res) => {
    
  const invite = await ProjectInvite.findOne({
    token: req.query.token,
  }).populate("projectId");

  if (!invite) {
    return res.status(404).json({ message: "Invalid invite link" });
  }

  invite.status = "declined";
  await invite.save();

  res.json({ message: "Declined invite" });
};
