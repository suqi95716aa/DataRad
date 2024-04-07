## /* 会话列表数据结构 */
const chatbotList = [
	{
		id: string, // 会话id
		name: string, // 会话名称
		desc: string, // 会话描述
		// 会话记录
		records: [
			{
				id: string, // 会话记录id
				userType: number, // 1 用户 2 机器人
				value: string, // 输入的内容 文本内容
				type: number, // 类型 1 文本 2 统计图 3 表格  其他待定
				datetime: string | number, // 会话记录生成的时间
				sendSuccess: boolean, // 发送成功
				sendError: boolean, // 发送失败
				chartData: {}, // 统计图数据
				tableData: {}, // 表格数据
			}
		],
		// 配置信息
		settings: {
			name: string, // 会话名称
			desc: string, // 会话描述
			sourceName: string, // 数据源名称
			sourceId: string | number, // 数据源id
			// 分组
			groupList: [
				{
					id: string, // 分组id  (前端生成)
					checked: true, // 是否选中当前分组
					children: [
						{
							sheetName: string, // 数据表名
							tableId: string, // 数据表id
							fieldName: [], // 字段列表
						},
						{
							sheetName: null,
							fieldName: [],
						},
					],
				}
			],
		},
	}
]
