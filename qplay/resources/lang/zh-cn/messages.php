<?php
/**
 * Created by PhpStorm.
 * User: Moses.Zhu
 * Date: 2016/8/17
 * Time: 10:51
 */
return [
    //Common
    'MESSAGE' => '消息',
    'CANCEL' => '取消',
    'CLOSE' => '关闭',
    'CONFIRM' => '确认',
    'SAVE' => '保存',
    'RETURN' => '返回',
    'ERROR' => '错误',
    'DELETE'=> '删除',
    'NEW'=> '新增',
    'FROM' => '从',
    'REMOVE' => '移除',
    'SELECT' => '选择',
    'FILE'=>'档案',
    'BROWSE_FILE'=>'浏览档案',
    'MSG_OPERATION_SUCCESS' => '操作成功!',
    'MSG_OPERATION_FAILED' => '操作失败!',
    'MSG_CONFIRM_SAVE' => '确认保存?',
	'MSG_CONFIRM_COPY' => '确认复制?',
    'MSG_REQUIRED_FIELD_MISSING' => '必填项内容缺失!',
	'MSG_CONFIRM_LOGOUT' => '确认登出?',
    'MSG_REQUIRED_FIELD' => '此为必填栏位',
	'PAGING_SHOWING' => '当前显示',
	'PAGING_TO' => '至',
	'PAGING_OF' => '笔记录, 共',
	'PAGING_ROWS' => '笔记录',
	'PAGING_ROWS_PER_PAGE' => '笔记录每页',
	'STATUS_HAS_RIGHT' => '正常',
	'STATUS_HAS_NO_RIGHT' => '停权中',

    'MENU' => '菜单',
    'LOGOUT' => '登出',
    'TITLE_USER_MAINTAIN' => '用户管理',
    'TITLE_APP_MAINTAIN' => 'App管理',
    'TITLE_SYS_MAINTAIN' => '系统管理',
    'TITLE_PUSH_SERVER' => '讯息服务',
    'TITLE_ABOUT' => '关于',
    'TITLE_USER_ACCOUNT_MAINTAIN' => '帐号管理',
    'TITLE_USER_ROLE_MAINTAIN' => '企业角色管理',
    'TITLE_APP_ANDROID' => 'Android',
    'TITLE_APP_IOS' => 'iOS',
    'TITLE_APP_CATEGORY_MAINTAIN' => '类别维护',
    'TITLE_APP_SECURITY_SETTING' => '安全设置',
    'TITLE_SYS_MENU_MAINTAIN' => '选单维护',
    'TITLE_SYS_GROUP_MAINTAIN' => '系统群组管理',
    'TITLE_SYS_PARAMETER_MAINTAIN' => '参数设置',
    'TITLE_SYS_PROJECT_MAINTAIN' => '专案管理',

    //validate
    'VALIDATE_ACCEPT' => '仅接受',
    'VALIDATE_ACCEPT_NUMERIC' => '仅接受数字',

    //About
    'SYS_VERSION' => '系统版本',
    'SYS_SUGGEST_BROWSER' => '系统建议浏览器: Chrome, IE10以上版本',

    //Account Maintain
    'USER_LOGIN_ID' => '帐号',
    'USER_EMP_NO' => '员工编号',
    'USER_EMP_NAME' => '员工姓名',
    'USER_EMAIL' => '邮箱',
    'USER_DOMAIN' => '域',
    'USER_COMPANY' => '公司',
    'USER_DEPARTMENT' => '部门',
    'USER_STATUS' => '状态',
    'ROLE' => '企业角色',
    'SYSTEM_GROUP' => '系统群组',
    'REMOVE_RIGHT' => '停权',
    'MSG_CONFIRM_REMOVE_RIGHT' => '确认将用户停权?',
    'MSG_REMOVE_RIGHT_FAILED' => '用户停权失败!',
    'MSG_BELONG_TO_GROUP_RIGHT' => '依系统群组权限',

    //Role Maintain
    'COMPANY_NAME' => '公司名称',
    'ROLE_NAME' => '角色名称',
    'USERS' => '用户',
    'ROLE_LIST' => '角色名单',
    'COPY_LIST' => '复制名单',
    'ADD_USER' => '加入用户',
    'MSG_CONFIRM_DELETE_ROLE' => '确认删除所选角色?',
    'MSG_ROLE_EXIST_USERS' => '无法删除角色, 角色下存在用户!',
    'MSG_DELETE_ROLE_FAILED' => '删除角色失败!',
    'MSG_SAVE_ROLE_FAILED' => '新增角色失败!',
    'MSG_NEW_ROLE' => '新增角色',
    'MSG_EDIT_ROLE' => '编辑角色',
    'MSG_COPY_LIST_SUCCESS' => '复制用户清单成功!',
    'MSG_CONFIRM_REMOVE_USER' => '确定移除所选用户?',
    'SELECT_USER' => '选择用户',

    //Menu Maintain
    'MENU_NAME' => '菜单名',
    'LINK' => '链接',
    'ENGLISH_NAME' => '英文名',
    'SIMPLE_CHINESE_NAME' => '简体中文名',
    'TRADITIONAL_CHINESE_NAME' => '繁体中文名',
    'SEQUENCE' => '序号',
    'NEW_ROOT_MENU' => '新增父选单',
    'NEW_SUB_MENU' => '新增子选单',
    'EDIT_SUB_MENU' => '编辑子选单',
    'SUB_MENU' => '子选单',
    'MSG_CONFIRM_DELETE_MENU' => '确认删除所选菜单?',
    'MSG_EXIST_SUBMENU' => '无法删除, 存在子菜单!',
    'MSG_DELETE_MENU_FAILED' => '删除菜单失败!',
	'MSG_MENU_NAME_EXIST' => '菜单名称已存在!',

    //Group Maintain
    'GROUP_NAME' => '群组名称',
    'GROUP_LIST' => '群组名单',
    'MSG_CONFIRM_DELETE_GROUP' => '确认删除所选群组?',
    'MSG_GROUP_EXIST_USERS' => '无法删除, 群组下存在用户!',

    //Parameter Setting
    'PARAMETER_TYPE' => '参数类型',
    'PARAMETER' => '参数',
    'PARAMETER_TYPE_NAME' => '类别名称',
    'DESCRIPTION' => '描述',
    'PARAMETER_NAME' => '参数名称',
    'PARAMETER_VALUE' => '参数值',
    'MSG_CONFIRM_DELETE_TYPE' => '确认删除所选的参数类别?',
    'MSG_NEW_TYPE' => '新增参数类别',
    'MSG_EDIT_TYPE' => '编辑参数类别',
    'MSG_CONFIRM_DELETE_PARAMETER' => '确认删除所选的参数?',
    'MSG_NEW_PARAMETER' => '新增参数',
    'MSG_EDIT_PARAMETER' => '编辑参数',

    //App Category Maintain
    'CATEGORY_NAME' => '类别名',
    'CATEGORY_APP_COUNT' => 'App',
    'ADD_APP' => '加入 App',
    'ICON' => 'Icon',
    'APP_NAME' => 'App 名称',
    'LAST_UPDATED_DATE' => '最后更新日期',
    'RELEASED' => '发布状态',
    'SELECT_APP' => '选择 App',
    'MSG_NEW_CATEGORY' => '新增类别',
    'MSG_EDIT_CATEGORY' => '编辑类别',
    'MSG_SAVE_CATEGORY_FAILED' => '新增类别失败!',
    'MSG_CONFIRM_DELETE_CATEGORY' => '确认删除所选类别?',
    'MSG_CATEGORY_EXIST_APPS' => '无法删除类别, 类别下存在apps!',
    'MSG_DELETE_CATEGORY_FAILED' => '删除类别失败!',
    'MSG_CONFIRM_REMOVE_APP' => '移除类别后将为未分类APP，可能影响用户权限，确认移除?',
    'MSG_CONFIRM_ADD'=>'确认加入?',
    'MSG_CONFIRM_ADD_APPS_TO_CATEGORY'=>'系统将调整APP类别 %s 加入',

	//Push Message
	'NEW_MESSAGE' => '新增讯息',
	'MESSAGE_TYPE' => '类别',
	'MESSAGE_TITLE' => '标题',
	'TEMPLATE_ID' => '模板编号',
	'CREATED_DATE' => '创建日期',
	'MESSAGE_CREATED_USER' => '推播者',
	'ADD_RECEIVER' => '加入更多收讯者',
	'MSG_CONFIRM_REMOVE_RECEIVER' => '确认移除收讯者? 以下人员将不会收到推播',
	'STATUS' => '状态',
	'PUSH_TO' => '推播至',
	'PUSH_TYPE' => '推播类别',
	'MESSAGE_CONTENT' => '内文',
	'MESSAGE_RECEIVER' => '收讯者',
	'PUSH_IMMEDIATELY' => '立即推播',
	'MSG_CONFIRM_PUSH_IMMEDIATELY' => '系统将发出%s推播, 推播后将无法修改内容和收件人!',
	'MSG_CONFIRM_SAVE_IMMEDIATELY' => '系统将保存%s推播',
	'MSG_MUST_CHOOSE_RECEIVER' => '必须选择接收者!',
	'MESSAGE_SEND_HISTORY' => '推播纪录',
	'PUSH_DATE' => '日期',
	'PUSH_SOURCE_USER' => '推播者',
	'COPY_MESSAGE' => '复制推播',
	'PUSH_AGAIN' => '再推播',
	'MSG_CONFIRM_PUSH_AGAIN' => '系统将发出%s推播',
	'MSG_EVENT_INFORMATION' => '*Event为个别或紧急通知，仅能选择群组或个人推播',
	'MSG_NEWS_INFORMATION' => '*News为公开式公告，仅能依公司别推播',
	'MSG_PUSH_TITLE_PLACEHOLDER' => '(请注意: 具敏感性内容请填写于内文)',
	'PUBLISH_STATUS'=>'发布状态',
	'MSG_PUSH_SUCCESS' => '推送成功!',
	'MSG_CONFIRM_SAVE_PUSH_STATUS_Y' => '系统将重新发布【%s】所有收讯者将可阅读该推播',
	'MSG_CONFIRM_SAVE_PUSH_STATUS_N' => '系统将取消发布【%s】所有收讯者无法阅读该推播',

    //App Security Setting
    'BLOCK_LIST' => '黑名单',
    'BLOCK_HINT'=> '(列表中的设备IP来源将无法访问与使用Qplay服务)',
    'BLOCK_IP' => 'IP',
    'BLOCK_DESCRIPT' => '描述',
    'MSG_NEW_BLOCK' => '新增黑名单',
    'MSG_EDIT_BLOCK' => '编辑黑名单',
    'MSG_CONFIRM_DELETE_BLOCK' => '确定删除所选黑名单?',
    'MSG_DELETE_BLOCK_FAILED' => '删除黑名单失败!',
    'MSG_SAVE_BLOCK_FAILED' => '储存黑名单失败!',

     //App Maintain
    'NEW_APP' => '新增应用程式',
    'APP_PACKAGE_NAME' => 'Package Name',
    'APP_KEY' => 'App Key',
    'DEFAULT_LANG' => '预设语言',
    'SELECT_APP_KEY' => '选择App Key',
    'APP_SUMMARY'=>'App 摘要',
    'APP_DESCRIPTION'=>'App 描述',
    'CUSTOM_API_INFORMATION'=>'API 资讯',
    'NEW_CUSTOM_API'=>'新增 API',
    'CUSTOM_API_ACTION'=>'API Action',
    'CUSTOM_API_VERSION'=>'API 版本',
    'CUSTOM_API_URL' => 'API Url',
    'ERROR_CODE' => '错误代码',
    'NEW_ERROR_CODE' => '上传错误代码',
    'CURRENT_ERROR_CODE' => '目前错误代码',
    'APP_CATEGORY' => '应用程式分类',
    'NON_CATEGORY' => '未分类',
    'SECURITY_LEVEL' => '安全级别',
    'SECURITY_HIGH' => '高阶',
    'SECURITY_MIDDIUM' => '中阶',
    'SECURITY_NORMAL' => '一般',
    'SECURITY_HINT_HIGH' => '需登入QPlay，且开启App或Resume时需再次输入密码',
    'SECURITY_HINT_MIDDIUM' => '需登入QPlay，且开启App时需再次输入密码',
    'SECURITY_HINT_NORMAL' => '登入QPlay即可使用该App',
    'ERROR_CODE_HINT' => '一App仅接受一份错误代码，再上传会取代原档案',
    'USER_SETTING' => '用户设定',
    'USER_SETTING_BY_COMPOANY' => '依公司选择',
    'USER_SETTING_BY_ROLE' => '依企业角色选择',
    'ICON' => '大图示',
    'NEW_ICON' => '新增大图示',
    'SCREENSHOT' => '萤幕撷取画面',
    'UPLOAD_NEW_VERSION' => '上传新版本',
    'UPLOAD_NEW_EXTERNAL_LINK' => '新增外部连结',
    'EXTERNAL_LINK' => '连结',
    'VERSION_NAME' => '版本名称',
    'VERSION_NO' => '版本号',
    'VERSION_URL' => '版本路径',
    'VERSION_LOG' => '版本描述',
    'UPLOAD_TIME' => '上传时间',
    'VERSION_STATUS' => '状态',
    'EDIT_VERSION' => '修改版本',
    'TAB_INFORMATION' => '应用程式资讯',
    'TAB_PIC_INFORMATION' => '图示资讯',
    'TAB_VERSION_CONTROLL' => '版本控制',
    'TAB_WHITE_LIST_SETTING' => '白名单设定',
    'BTN_LANGUAGE' => '语言',
    'BTN_LANGUAGE_SETTING' => '管理语言',
    'BTN_LANGUAGE_NEW' => '新增语言',
    'BTN_LANGUAGE_REMOVE' => '移除语言',
    'BTN_LANGUAGE_CHANGE_DEFAULT' => '变更预设语言',
    'MSG_NEW_WHITE' => '新增白名单',
    'MSG_EDIT_WHITE' => '编辑白名单',
    'MSG_CONFIRM_DELETE_WHITE' => '确定删除所选白名单?',
    'MSG_DELETE_WHITE_FAILED' => '删除白名单失败!',
    'MSG_SAVE_WHITE_FAILED' => '储存白名单失败!',
    'MSG_NEW_CUSTOM_API' => '新增API',
    'MSG_EDIT_CUSTOM_API' => '编辑API',
    'MSG_CONFIRM_DELETE_CUSTOM_API' => '确定删除所选API?',
    'MSG_DELETE_CUSTOM_API_FAILED' => '删除API失败!',
    'MSG_SAVE_CUSTOM_API_FAILED' => '储存API失败!',
    'MSG_CONFIRM_DELETE_APP_USER' => '确定删除所选用户?',
    'MSG_DELETE_APP_USER_FAILED' => '删除用户失败!',
    'MSG_SAVE_APP_USER_FAILED' => '新增用户失败!',
    'MSG_NO_CHANGABLE_LANGUAGE' => '没有可变更的语言',
    'MSG_CONFIRM_DELETE_VERSION' => '系统将删除所选版本，确认删除?',
    'MSG_VERSION_CAN_NOT_DELETE' => '无法删除',
    'MSG_VERSION_IS_PUBLISH_CAN_NOT_DELETE' => '所选版本为发布状态，不可删除',
    'ERR_JSON_PARSING_ERROR' => 'json 档案解析失败，请确认上传档案的内容!',
    'ERR_APP_KEY_INCORRECT_ERROR' => '上传档案appkey与专案不符，请确认上传档案内容!',
    'ERR_VERSION_NO_DUPLICATE' => '版本号不可重复',
    'ERR_VERSION_NAME_DUPLICATE' => '版本名称不可重复',

	//Project Maintain
	'PROJECT_CODE' => '专案代码',
	'PROJECT_DESCRIPTION' => '专案描述',
	'PROJECT_PM' => 'PM',
	'PROJECT_MEMO' => 'Memo',
	'MSG_CONFIRM_DELETE_PROJECT' => '确认删除所选专案?',

	'ERR_EXIST_ROLE' => '角色在当前公司内已存在!',
	'ERR_GROUP_NAME_EXIST' => '群组名称已存在!',
	'ERR_TYPE_NAME_EXIST' => '参数类别已存在!',
	'ERR_PROJECT_EXIST_APP' => '该专案下有发布中的App, 不可删除!',
	'ERR_PROJECT_CODE_EXIST' => '专案代码已存在!',
	'ERR_PROJECT_PM_NOT_EXIST' => 'PM不存在!',
	'ERR_APP_KEY_EXIST' => 'App key已存在!',
	'ERR_PARAMETER_NAME_EXIST_IN_TYPE' => '参数名称在该参数类别下已存在!',
	'ERR_EXIST_PARAMETER_IN_TYPE' => '该类别下存在参数!',
	'ERR_USER_HAS_IN_GROUP' => '用户已在其他群组中!',
	'ERR_MUST_CHOOSE_GROUP' => '必须选择一个群组!',
	'ERR_MESSAGE_INVISIBLE' => '消息不是发布状态, 无法推送!',
	'ERR_OUT_OF_LENGTH' => '%s 不能长于 %l 位!',
	'ERR_ADMIN_GROUP_CAN_NOT_DELETE' => 'Administrator群组无法删除!',
	'ERR_GROUP_CAN_NOT_NAMED_ADMIN' => 'Administrator是系统群组, 无法使用该名称!',
    'ERR_APP_CATEGORY_EXIST' => 'App 类别名称已经存在!',
    'ERR_WRONG_TYPE'=>'请输入正确的 %s 格式!'
];