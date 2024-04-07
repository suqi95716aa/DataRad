/** 用户相关模块 */
declare namespace Auth {
  /**
   * 用户角色类型(前端静态路由用角色类型进行路由权限的控制)
   * - super: 超级管理员(该权限具有所有路由数据)
   * - admin: 管理员
   * - user: 用户
   */
  type RoleType = 'super' | 'admin' | 'user';

  /** 用户信息 */
  interface UserInfo {
    /** 用户id */
    userId: string;
    /** 用户名 */
    userName: string;
    /** 用户角色类型 */
    userRole: RoleType;
		/** 用户手机号码 */
		userPhone?: string;
		expire?: number | string;
  }

	/** 记住用户账密 */
	type UpInfoType = {
		name: string,
		pwd: string
	}

	type wdInfoType = {
		[key: string]: any
	}

	/** 数据源配置信息 */
	type wdConfigInfo = wdInfoType[]
}

declare namespace UserManagement {
  interface User extends ApiUserManagement.User {
    /** 序号 */
    index: number;
    /** 表格的key（id） */
    key: string;
  }

  /**
   * 用户性别
   * - 0: 女
   * - 1: 男
   */
  type GenderKey = NonNullable<User['gender']>;

  /**
   * 用户状态
   * - 1: 启用
   * - 2: 禁用
   * - 3: 冻结
   * - 4: 软删除
   */
  type UserStatusKey = NonNullable<User['userStatus']>;
}

declare namespace Robot {
	type RecordSourceDataType = {
		[key: string]: any
	}
	type ChatbotRecordDataType = {
		sourceData: RecordSourceDataType[],
		sourceType: RecordSourceDataType,
		sql?: string,
		spss_reasoning?: string
	}

	type ChatbotRecordType = {
		id?: string, // 会话记录id
		userType?: number, // 1 用户 2 机器人
		value?: string, // 输入的文本内容
		type?: number, // 类型 1 文本 2 统计图 3 表格  其他待定
		datetime?: string | number, // 日期时间
		loading?: boolean, // 加载中
		loaded?: boolean, // 加载完成
		state: number, // 状态 0 未发送 1 发送成功 -1 发送失败 -2 加载失败
		data: ChatbotRecordDataType // 数据
		isDelete?: boolean // 是否删除
	}

	type ChatbotOptionsType = {
		[key: string]: any
	}

	type GroupListItemChildrenType = {
		sheetName?: string,
		fieldName?: string,
		fieldType?: string
	}

	type SheetFieldType = {
		label: string,
		value: string,
		type?: string,
		disabled?: boolean
	}

	type SheetType = {
		label: string,
		value: string,
		disabled?: boolean,
		fields: SheetFieldType[] // 字段下拉列表
	}

	type GroupListItemType = {
		id?: string | number,
		checked?: number | boolean,
		sheets: SheetType[], // 数据表下拉列表
		children: GroupListItemChildrenType[]
	}

	type ScreenBasicConfigType = {
		ScreenDesc?: string, // 场景描述
		ScreenName?: string // 场景名称
	}

	type ScreenQAConfigType = {
		ConfigId?: string, // 数据源id
		ConfigName?: string, // 数据源名称
		GroupList?: GroupListItemType[], // 分组列表
		isSpread?: boolean, // 是否展开分组
	}

	type ModelConfigType = {
		[key: string]: any
	}

	type ChatbotSettingsType = {
		ScreenBasicConfig?: ScreenBasicConfigType, // 基础配置
		ScreenQAConfig?: ScreenQAConfigType, // 数据源配置
		modelConfig?: ModelConfigType
	}

	type UpdateChatbotItemType = {
		[key: string]: any
	}

	/* 会话列表 */
	type ChatbotItemType = {
		screenName?: string,
		CreateTime?: string,
		UpdateTime?: string,
		ScreenId?: string,
		Uid?: string,
		settings?: ChatbotSettingsType, // 配置信息
		isEdit?: boolean
	}

	/* 会话记录 */
	type ChatbotRecordsType = {
		id: string,
		list: ChatbotRecordType[]
	}
}
