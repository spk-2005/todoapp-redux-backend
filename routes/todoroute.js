const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");

// Fetch todos by user email
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`Fetching todos for user: ${email}`);

    const todos = await Todo.find({ userEmail: email });

    if (!todos.length) {
      return res.status(404).json({ message: "No todos found for this user" });
    }

    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a new todo
router.post("/", async (req, res) => {
  try {
    const { text, email } = req.body;

    if (!text || !email) {
      return res.status(400).json({ message: "Text and email are required" });
    }

    console.log(`Creating todo for user: ${email} - Text: ${text}`);

    const newTodo = new Todo({ text, userEmail: email, completed: false });
    const savedTodo = await newTodo.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ message: "Failed to create todo" });
  }
});

// Update a todo
router.put("/:id", async (req, res) => {
  try {
    console.log(`Updating todo: ${req.params.id} with data:`, req.body);

    const { text, completed } = req.body;
    if (text === undefined && completed === undefined) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { text, completed },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Failed to update todo" });
  }
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  try {
    console.log(`Deleting todo: ${req.params.id}`);

    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Failed to delete todo" });
  }
});

module.exports = router;
