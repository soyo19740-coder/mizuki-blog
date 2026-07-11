import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar-new.png", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
	name: "羽毛笔",
	bio: "记录笔记、阅读、技术与日常观察。",
	typewriter: {
		enable: true, // 启用个人简介打字机效果
		speed: 80, // 打字速度（毫秒）
	},
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/soyo19740-coder",
		},
	],
};
