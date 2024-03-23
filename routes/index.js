var express = require("express");
var router = express.Router();
const User = require("../models/user");
const Task = require("../models/task");
const excelJs = require("exceljs");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/createUser", function (req, res, next) {
  res.render("createUser", { title: "Create" });
});
router.post("/createUser", function (req, res, next) {
  const user = new User(req.body); // req.body is the data sent by the form
  user.save();
  res.redirect("/allUsers");
});
router.get("/allUsers", async function (req, res, next) {
  const users = await User.find();
  res.render("allUsers", { users: users });
});
router.get("/manageTask/:id", async function (req, res, next) {
  try {
    const currentUser = await User.findById(req.params.id);
    const tasks = await Task.find({ userId: req.params.id });
    res.render("manageTask", { user: currentUser, tasks: tasks });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
router.post("/addTask", async function (req, res, next) {
  try {
    const task = new Task(req.body);
    const user = await User.findById(req.body.userId);
    task.userId = req.body.userId;
    user.tasks.push(task._id);
    await task.save();
    await user.save();
    res.redirect(`/manageTask/${req.body.userId}`);
  } catch (error) {
    res.send("Error in adding task");
  }
});
router.get("/delete/:id", async function (req, res, next) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/allUsers");
  } catch (error) {
    res.send("Error in deleting");
  }
});

//Excel routes
router.get("/exportUsers", async function (req, res, next) {
  try {
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Users");
    worksheet.columns = [
      { header: "S_no.", key: "s_no", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "mobile", width: 30 },
    ];
    let count = 1;
    const userData = await User.find();

    userData.forEach((user) => {
      user.s_no = count;
      worksheet.addRow(user);
      count++;
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "users.xlsx"
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  } catch (error) {
    res.send(error.message);
  }
});
router.get("/exportTasks/:id", async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id).exec();
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Tasks");
    worksheet.columns = [
      { header: "S_no.", key: "s_no", width: 10 },
      { header: "Email", key: "email", width: 30 },
      { header: "Task name", key: "taskName", width: 30 },
      { header: "Task Type", key: "taskType", width: 30 },
      { header: "Task Status", key: "status", width: 30 },
    ];
    let count = 1;
    const tasks = await Task.find({ userId: req.params.id });

   
    tasks.forEach((task) => {
      task.s_no = count;
      task.email = user.email;
      worksheet.addRow(task);
      count++;
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "tasks.xlsx"
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
