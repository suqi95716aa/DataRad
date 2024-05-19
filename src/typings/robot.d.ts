declare namespace Robot {

	/* 会话场景 */
	interface Chatbot {
		CreateTime: string;
		UpdateTime: string;
		ScreenId: string;
		ScreenType: string;
		Uid: string;
		settings: Settings; // 配置信息
		isEdit?: boolean;
		screenName?: string;
	}


	/* 会话场景配置信息 */
	interface Settings {
		ScreenBasicConfig: ScreenBasicConfig; // 基础配置
		ScreenQAConfig: ScreenQAConfig; // 数据源配置
		modelConfig?: ModelConfigType;
	}

	interface ScreenBasicConfig {
		ScreenDesc: string; // 场景描述
		ScreenName: string; // 场景名称
	}

	interface ScreenQAConfig {
		ConfigId: string; // 数据源id
		ConfigName: string; // 数据源名称
		GroupList: GroupList[]; // 分组列表
		KBIDS: KBIDS[],
		RelevantHits: string,
		SimilarityThreshold: string,
		isSpread?: boolean; // 是否展开分组
	}

	interface ModelConfigType {
		[key: string]: any;
	}

	/* 分组列表 */
	interface GroupList {
		id?: string | number;
		checked?: number | boolean;
		sheets: SheetType[]; // 数据表下拉列表
		children: GroupListChildren[];
	}

	interface KBIDS {
		[key: string]: any
	}

	interface GroupListChildren {
		sheetName?: string;
		fieldName?: string;
		fieldType?: string;
	}

	/* 会话记录列表 */
	interface Records {
		id: string;
		list: Record[];
	}
	/* 会话记录 */
	interface Record {
		id: string; // 会话记录id
		userType: number; // 1 用户 2 机器人
		value: string; // 输入的文本内容
		datetime: string | number; // 日期时间
		loading: boolean; // 加载中
		loaded: boolean; // 加载完成
		isWelcome?: boolean; // 是否回复欢迎语
		isTipsReply?: boolean; // 是否回复提示
		replyType?: number, // 回复类型 0 问候语 1 错误提示语 2 未配置提示语
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


	/* 分组的数据表 */
	interface SheetType {
		label: string;
		value: string;
		disabled?: boolean;
		fields: Fields[]; // 字段下拉列表
	}

	interface Fields {
		label: string;
		value: string;
		type?: string;
		disabled?: boolean;
	}
}
