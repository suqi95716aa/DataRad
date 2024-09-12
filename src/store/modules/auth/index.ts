import { unref, nextTick } from "vue";
import { defineStore } from "pinia";
import { router } from "@/router";
import { fetchLogin, fetchUserInfo, fetchUserConfigInfo } from "@/service";
import { useRouterPush } from "@/composables";
import { localStg } from "@/utils";
import { decrypto } from '@/utils/crypto';
import { REGEXP_PHONE } from '@/config';
import { useTabStore } from "../tab";
import { useRouteStore } from "../route";
import { useRobotStore } from '../robot';
import { useAppStore } from '../app';
import { useKnowledgeStore } from '../knowledge';
import {
	getToken,
	getUserInfo,
	getPwd,
	getUpInfo,
	getUserConfigInfo,
	clearAuthStorage,
} from "./helpers";

interface AuthState {
	/** 用户信息 */
	userInfo: Auth.UserInfo;
	/** 用户token */
	token: string;
	/** 登录的加载状态 */
	loginLoading: boolean;
	/** 问答数据源配置信息 */
	wdConfigInfo: Auth.wdConfigInfo;
	/** 用户密码 */
	pwd: string;
	/** 记住用户账密 */
	upInfo: Auth.UpInfoType;
}


export const useAuthStore = defineStore("auth-store", {
	state: (): AuthState => ({
		userInfo: getUserInfo(),
		token: getToken(),
		loginLoading: false,
		wdConfigInfo: getUserConfigInfo(),
		pwd: getPwd(),
		upInfo: getUpInfo()
	}),
	getters: {
		/** 是否登录 */
		isLogin(state) {
			return Boolean(state.token);
		},
	},
	actions: {
		/** 重置auth状态 */
		resetAuthStore() {
			const { toLogin } = useRouterPush(false);
			const { resetTabStore } = useTabStore();
			const { resetRouteStore } = useRouteStore();
			const { clearKnowledgeStorage } = useKnowledgeStore()
			const app = useAppStore();
			const route = unref(router.currentRoute);


			app.closeRobotDialog();

			clearAuthStorage();
			clearKnowledgeStorage();
			this.$reset();

			if (route.meta.requiresAuth) {
				toLogin();
			}

			nextTick(() => {
				resetTabStore();
				resetRouteStore();
			});
		},
		/**
		 * 处理登录后成功或失败的逻辑
		 * @param backendToken - 返回的token
		 */
		async handleActionAfterLogin(backendToken: ApiAuth.Token) {
			const route = useRouteStore();
			const { toLoginRedirect } = useRouterPush(false);

			const loginSuccess = await this.loginByToken(backendToken);

			if (loginSuccess) {
				await route.initAuthRoute();

				// 跳转登录后的地址
				toLoginRedirect();

				// 登录成功弹出欢迎提示
				if (route.isInitAuthRoute) {
					window.$notification?.success({
						title: "登录成功!",
						content: `欢迎回来，${this.userInfo.userName}!`,
						duration: 3000,
					});
				}

				return;
			}

			// 不成功则重置状态
			this.resetAuthStore();
		},
		/**
		 * 根据token进行登录
		 * @param backendToken - 返回的token
		 */
		async loginByToken(backendToken: ApiAuth.Token) {
			const { getScreenList } = useRobotStore()
			let successFlag = false;

			// 先把token存储到缓存中(后面接口的请求头需要token)
			const { token, refreshToken } = backendToken;

			localStg.set("token", token);
			// localStg.set("refreshToken", refreshToken);

			this.token = token;
			let data: any = decrypto(token)
			const userInfo = {
				userId: data?.uid,
				userName: data?.username,
				userRole: 'user' as Auth.RoleType,
				userPhone: data?.userphone,
				expire: data?.expire
			}
			console.log('userInfo---', userInfo)
			this.userInfo = userInfo;
			this.token = token;
			localStg.set("userInfo", userInfo);

			this.getWdConfigInfo();
			getScreenList();

			successFlag = true;

			// 获取用户信息
			// const { data } = await fetchUserInfo();
			// if (data) {
			// 	// 成功后把用户信息存储到缓存中
			// 	data.userId = "46c44d4";
			// 	localStg.set("userInfo", data);

			// 	// 更新状态
			// 	this.userInfo = data;
			// 	this.token = token;

			// 	this.getWdConfigInfo();
			// 	getScreenList();

			// 	successFlag = true;
			// }

			return successFlag;
		},
		/**
		 * 登录
		 * @param userName - 用户名
		 * @param password - 密码
		 */
		async login(userName: string, password: string, isRememberMe: boolean = false) {
			this.loginLoading = true;
			// const { data } = await fetchLogin(userName, password);
			const formData = new FormData();
			formData.append("password", password);
			if (REGEXP_PHONE.test(userName)) {
				formData.append("loginType", "1");
				formData.append("userphone", userName);
			} else {
				formData.append("loginType", "0");
				formData.append("username", userName);
			}
			const { data } = await fetchLogin(formData) as any;
			console.log('data--------', data)
			if (data) {
				if (data?.access_token) {
					let upInfo = {
						name: '',
						pwd: ''
					}
					if (isRememberMe) {
						upInfo.name = userName;
						upInfo.pwd = password;
					}
					this.pwd = password;
					this.upInfo = upInfo;
					localStg.set("upInfo", upInfo);
					localStg.set("pwd", password);
					await this.handleActionAfterLogin({ token: data.access_token });
				} else {
					window.$message?.warning('登录失败，账号或密码不正确！')
				}
			}
			this.loginLoading = false;
		},
		/**
		 * 更换用户权限(切换账号)
		 * @param userRole
		 */
		async updateUserRole(userRole: Auth.RoleType) {
			const { resetRouteStore, initAuthRoute } = useRouteStore();

			const accounts: Record<
				Auth.RoleType,
				{ userName: string; password: string }
			> = {
				super: {
					userName: "Super",
					password: "super123",
				},
				admin: {
					userName: "Admin",
					password: "admin123",
				},
				user: {
					userName: "User01",
					password: "user01123",
				},
			};
			const { userName, password } = accounts[userRole];
			const formData = new FormData();
			formData.append("password", password);
			formData.append("loginType", "0");
			formData.append("username", userName);
			const { data } = await fetchLogin(formData) as any;
			if (data?.access_token) {
				await this.loginByToken({ token: data.access_token });
				resetRouteStore();
				initAuthRoute();
			}
		},
		async getWdConfigInfo() {
			const formData = new FormData();
			formData.append("Uid", this.userInfo.userId);
			const { data } = await fetchUserConfigInfo(formData);

			if (data) {
				let configInfoList = data?.configInfo || [];
				configInfoList.forEach((item: any) => {
					let sheetOpts = item.SheetNames && item.SheetNames.map((name: string) => {
						return {
							label: name,
							value: name,
							fieldOpts: []
						}
					}) || []
					item.sheetOpts = sheetOpts
				});

				configInfoList = configInfoList.filter((item: any) => item?.Status !== 400)

				localStg.set("wdConfigInfo", configInfoList);
				this.wdConfigInfo = configInfoList;
				console.log('this.wdConfigInfo----aa', this.wdConfigInfo)
			} else {
				localStg.set("wdConfigInfo", []);
				this.wdConfigInfo = []
			}
		},
		addWdConfigInfo(info: Auth.wdInfoType) {
			this.wdConfigInfo.push(info);
			const list: any = this.wdConfigInfo;
			localStg.set("wdConfigInfo", list);
		},
		delWdConfigInfo(id: string) {
			let list: any = this.wdConfigInfo;
			const fIndex = list.findIndex((item: any) => item.ConfigId === id);

			if (fIndex !== -1) {
				list.splice(fIndex, 1);
				this.wdConfigInfo = list;
				localStg.set("wdConfigInfo", list);
			}
		},
		updateWdConfigInfo(id: string, info: Auth.wdInfoType) {
			const list: any = this.wdConfigInfo;
			list.forEach((item: any) => {
				if (item.ConfigId === id) {
					item = Object.assign(item, info);
				}
			});
			localStg.set("wdConfigInfo", list);
			this.wdConfigInfo = list;
		}
	}
});
