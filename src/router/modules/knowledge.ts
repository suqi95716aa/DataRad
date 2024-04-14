const component: any = {
	name: 'knowledge',
	path: '/knowledge',
	component: 'basic',
	redirect: '/knowledge/list',
	meta: {
		title: '知识库',
		requiresAuth: true,
		icon: 'carbon:ibm-watson-knowledge-studio',
    order: 3,
	},
	children: [
		{
      name: 'knowledge_list',
      path: '/knowledge/list',
      component: 'self',
      meta: {
        title: '知识库',
        requiresAuth: true,
        icon: 'carbon:ibm-watson-knowledge-studio',
				activeMenu: 'knowledge',
				hide: true
      }
    },
		{
      name: 'knowledge_create',
      path: '/knowledge/create',
      component: 'self',
      meta: {
        title: '知识库',
        requiresAuth: true,
        icon: 'carbon:ibm-watson-knowledge-studio',
				activeMenu: 'knowledge',
				hide: true
      }
    },
		{
      name: 'knowledge_details',
      path: '/knowledge/details',
      component: 'self',
      meta: {
        title: '知识库',
        requiresAuth: true,
        icon: 'carbon:ibm-watson-knowledge-studio',
				activeMenu: 'knowledge',
				hide: true
      }
    },
	]
}


export default component;
