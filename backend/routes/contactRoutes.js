const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // You can save it to a database or send it to an email (example below logs it)
    console.log("New contact message:", { name, email, message });

    return res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
