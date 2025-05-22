# Airwallex Webhook 设置指南

## 1. Webhook概述

Webhook是一种允许Airwallex在支付状态变化时通知您的应用程序的机制。这对于确保订单状态与支付状态保持同步非常重要。

## 2. 环境变量配置

除了之前设置的环境变量外，您还需要在Vercel添加以下环境变量：

```
AIRWALLEX_WEBHOOK_SECRET=your_webhook_secret
```

您可以自行生成一个安全的密钥，或者使用Airwallex提供的密钥。

## 3. 在Airwallex中设置Webhook

1. 登录Airwallex商户后台
2. 导航至"开发者设置" > "Webhooks"
3. 点击"添加Webhook"
4. 配置以下信息：
   - Webhook URL: `https://您的域名/api/payments/webhook`
   - 事件类型：选择以下事件
     - `payment_intent.succeeded`
     - `payment_intent.failed`
     - `payment_intent.cancelled`
   - 密钥：输入您生成的密钥（与环境变量中的相同）
5. 保存设置

## 4. 测试Webhook

Airwallex提供了测试Webhook的功能：

1. 在Webhook设置页面，找到您的Webhook配置
2. 点击"发送测试事件"按钮
3. 选择一个事件类型并发送
4. 检查应用程序日志，确认事件是否被正确处理

## 5. 注意事项

- 确保您的服务器可以公开访问，以便Airwallex能够发送通知
- Webhook通知会重试多次，请确保您的处理逻辑是幂等的（多次处理同一事件不会产生不同结果）
- 建议在日志中记录所有收到的Webhook事件，以便排查问题

## 6. 安全最佳实践

- 始终验证Webhook签名，防止伪造请求
- 不要在Webhook处理程序中执行长时间运行的任务，应该迅速响应并将实际处理放入队列
- 定期轮换Webhook密钥以提高安全性
