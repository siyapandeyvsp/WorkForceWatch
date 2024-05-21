const express = require("express"); //node modules se import direct hota h
const cors = require("cors");
const userRouter = require("./routers/userRouter");
const employeeRouter = require("./routers/employeeRouter");
const companyRouter = require("./routers/companyRouter");
const taskRouter = require("./routers/taskRouter");
const assignmentRouter=require("./routers/assignmentRouter");
const workSessionRouter = require("./routers/workSessionRouter");
const utilRouter = require("./routers/util");

const app = express();
const port = 5000;

// use cors as a middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.get("/", (req, res) => {
  res.send("response from express");
});

app.use(express.json());
app.use("/user", userRouter);
app.use("/employee", employeeRouter);
app.use("/company", companyRouter);
app.use("/task", taskRouter);
app.use("/assignment",assignmentRouter);
app.use("/work-session", workSessionRouter);
app.use("/util", utilRouter);

app.use(express.static("./static/uploads"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
