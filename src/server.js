const express = require('express');
const cors = require('cors');
const notifier = require('node-notifier');
const app = express();
const PORT = 19283;

// 配置CORS选项
const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// 启用CORS
app.use(cors(corsOptions));

// 中间件，用于解析JSON请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST接口，接收appname、title、description参数
app.post('/api/notify', (req, res) => {
  const { devicename, appname, title, description } = req.body;
  
  // 验证参数是否存在
  if (!appname || !title || !description) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数，请提供appname、title和description'
    });
  }
  
  // 处理接收到的数据
  console.log('接收到的数据:', {
    appname,
    title,
    description,
    timestamp: new Date().toISOString()
  });
  
  notifier.notify({
    title: `[${devicename}]${appname}: ${title}`,
    message: description,
    sound: true, // 播放通知声音
    wait: false // 不等待用户操作
  });
  
  // 返回成功响应
  res.status(200).json({
    success: true,
    message: '数据已成功接收并发送系统通知'
  });
});

// 简单的GET请求处理，用于测试服务器是否正常运行
app.get('/', (req, res) => {
  res.send('服务器正常运行中，请使用POST方法访问 /api/notify 接口');
});

// 启动服务器，监听所有网络接口以便局域网访问
app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器已启动，监听端口 ${PORT}`);
  console.log(`局域网访问地址: http://<本机IP>:${PORT}`);
});