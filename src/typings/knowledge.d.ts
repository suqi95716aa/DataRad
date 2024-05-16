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

	interface Chunk_info {
		chunk_num: string;
		text: string;
	}

	interface Previews {
		type: string;
		file_name: string;
		chunk_num: number;
		total_chunk_num: number;
		chunk_info: Chunk_info[];
	}

	interface Chunks_info {
		pk: number;
		text: string;
		sequence: number;
	}
	interface KDetails {
		total: number;
		chunks_info: Chunks_info[];
	}
}
