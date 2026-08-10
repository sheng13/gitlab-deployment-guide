# GitLab CE 19.2 本地部署与管理指南

![GitLab 自托管指南封面](./images/gitlab-self-hosted-cover.png)

在 Ubuntu 24.04 + Docker Compose 上实际验证过的中文教程，涵盖安装、普通用户操作、管理员管理、CI/CD、升级、完整备份、恢复演练、安全加固和故障排查。

- [完整图文教程](./gitlab_deployment_guide.md)
- [PDF 离线版](./GitLab_Local_Deployment_Guide.pdf)
- [Docker Compose 示例](./examples/docker-compose.yml)

实测基线为 GitLab CE `19.2.1-ce.0`。生产环境不要直接使用 `latest`。

## 本机验证结果（2026-08-10）

| 项目 | 结果 |
|---|---|
| Web | `http://192.168.70.196:8080`，HTTP 200 |
| Git SSH | `192.168.70.196:8022` |
| 镜像 | `gitlab/gitlab-ce:19.2.1-ce.0` |
| 容器 | `healthy`，核心服务运行 |
| 备份 | 应用备份、配置与密钥分别保存并校验 |

## 生成 PDF

```bash
npm install
npm run pdf
```

脚本自动寻找 Linux Google Chrome/Chromium，也可通过 `CHROME_PATH` 指定。仓库不会保存真实密码、Token、密钥或备份包。
