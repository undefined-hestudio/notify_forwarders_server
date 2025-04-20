const express = require("express");
const cors = require("cors");
const notifier = require("node-notifier");
const app = express();
const PORT = 19283;
const VERSION = "1.0.1"
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/notify", (req, res) => {
  const { devicename, appname, title, description } = req.body;

  if (!appname || !title || !description) {
    return res.status(400).json({
      success: false,
      message: "缺少必要参数，请提供appname、title和description",
    });
  }

  console.log("接收到的数据:", {
    appname,
    title,
    description,
    timestamp: new Date().toISOString(),
  });

  notifier.notify({
    title: `[${devicename}]${appname}: ${title}`,
    message: description,
    sound: true,
    wait: false,
  });

  res.status(200).json({
    success: true,
    message: "数据已成功接收并发送系统通知",
  });
});

app.get("/api/version", (req, res) => {
  res.send({
    version: VERSION
  })
})

app.get("/", (req, res) => {
  res.send("服务器正常运行中，请使用POST方法访问 /api/notify 接口");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`服务器已启动，监听端口 ${PORT}`);
  console.log(`局域网访问地址: http://<本机IP>:${PORT}`);
});
