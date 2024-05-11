declare namespace Knowledge {
	/* 知识 */
	interface K {
		KID: string;
		KName: string;
		KType: string;
		KConfig: any;
		KCreateTime: string;
		KUpdateTime: string;
	}
	/* 知识库 */
	interface Base {
		KBID: string;
		KBName: string;
		KBDesc: string;
		KBLabel: string;
		KBColor: string;
		KBBGImg: string;
		KBCreateTime: string;
		KBUpdateTime: string;
		data: K[];
	}
}
