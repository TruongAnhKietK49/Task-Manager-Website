import Task from "../models/tasks.js";

export const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;
    const tasks = await Task.find({
      projectId: req.query.projectId,
      title: { $regex: search, $options: "i" },
    })
      .populate("userId", "username email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments({
      projectId: req.query.projectId,
      title: { $regex: search, $options: "i" },
    });

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = new Task({ ...req.body, userId: req.user.id });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        projectId: req.body.projectId,
      },
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
