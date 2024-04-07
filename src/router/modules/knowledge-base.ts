const component: any = {
	name: 'knowledge-base',
	path: '/knowledge-base',
	component: 'basic',
	redirect: '/knowledge-base/list',
	meta: {
		title: '知识库',
		requiresAuth: true,
		icon: 'carbon:ibm-watson-knowledge-studio',
    order: 3,
	},
	children: [
		{
      name: 'knowledge-base_list',
      path: '/knowledge-base/list',
      component: 'self',
      meta: {
        title: '知识库',
        requiresAuth: true,
        icon: 'carbon:ibm-watson-knowledge-studio',
				activeMenu: 'knowledge-base',
				hide: true
      }
    },
		{
      name: 'knowledge-base_create',
      path: '/knowledge-base/create',
      component: 'self',
      meta: {
        title: '知识库',
        requiresAuth: true,
        icon: 'carbon:ibm-watson-knowledge-studio',
				activeMenu: 'knowledge-base',
				hide: true
      }
    },
		{
      name: 'knowledge-base_details',
      path: '/knowledge-base/details',
      component: 'self',
      meta: {
        title: '知识库',
        requiresAuth: true,
        icon: 'carbon:ibm-watson-knowledge-studio',
				activeMenu: 'knowledge-base',
				hide: true
      }
    },
	]
}


export default component;
