declare namespace Robot {
	/**
	 * 会话记录列表
	 *
	 */
	interface ChatbotRecordType {
		id: string; // 会话记录id
		userType: number; // 1 用户 2 机器人
		value: string; // 输入的文本内容
		datetime: string | number; // 日期时间
		loading: boolean; // 加载中
		loaded: boolean; // 加载完成
		isWelcome?: boolean; // 是否欢迎语回复
		isTipsReply?: boolean; // 是否提示回复
		replyType?: number, // 0 问候语 1 错误提示语 2 未配置提示语
		/**
		 * 状态 0 未发送 1 发送成功 -1 发送失败 -2 加载失败
		 */
		state: number;
		type: number; // 类型 1 文本 2 统计图 3 表格  其他待定
		data: RecordData; // 数据
		isDelete?: boolean; // 是否删除
	}

	interface RecordData {
		sourceData: SourceData[];
		sourceType: SourceType;
		sql?: string;
		spss_reasoning?: string;
	}

	interface SourceData {
		[key: string]: any;
	}

	interface SourceType {
		[key: string]: any;
	}

	interface ChatbotOptionsType {
		[key: string]: any;
	}

	interface GroupListItemChildrenType {
		sheetName?: string;
		fieldName?: string;
		fieldType?: string;
	}

	interface SheetFieldType {
		label: string;
		value: string;
		type?: string;
		disabled?: boolean;
	}

	interface SheetType {
		label: string;
		value: string;
		disabled?: boolean;
		fields: SheetFieldType[]; // 字段下拉列表
	}

	interface GroupListItemType {
		id?: string | number;
		checked?: number | boolean;
		sheets: SheetType[]; // 数据表下拉列表
		children: GroupListItemChildrenType[];
	}

	interface ScreenBasicConfigType {
		ScreenDesc?: string; // 场景描述
		ScreenName?: string; // 场景名称
	}

	interface ScreenQAConfigType {
		ConfigId?: string; // 数据源id
		ConfigName?: string; // 数据源名称
		GroupList?: GroupListItemType[]; // 分组列表
		isSpread?: boolean; // 是否展开分组
	}

	interface ModelConfigType {
		[key: string]: any;
	}

	interface ChatbotSettingsType {
		ScreenBasicConfig?: ScreenBasicConfigType; // 基础配置
		ScreenQAConfig?: ScreenQAConfigType; // 数据源配置
		modelConfig?: ModelConfigType;
	}

	interface UpdateChatbotItemType {
		[key: string]: any;
	}

	/* 会话列表 */
	interface ChatbotItemType {
		screenName?: string;
		CreateTime?: string;
		UpdateTime?: string;
		ScreenId?: string;
		Uid?: string;
		settings?: ChatbotSettingsType; // 配置信息
		isEdit?: boolean;
	}

	/* 会话记录 */
	interface ChatbotRecordsType {
		id: string;
		list: ChatbotRecordType[];
	}
}
