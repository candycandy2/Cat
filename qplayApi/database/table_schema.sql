# Host: localhost  (Version: 5.6.28-log)
# Date: 2016-06-21 10:06:51
# Generator: MySQL-Front 5.3  (Build 4.214)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "qp_api_log"
#

CREATE TABLE `qp_api_log` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_row_id` int(10) NOT NULL DEFAULT '0',
  `app_row_id` int(11) NOT NULL DEFAULT '0',
  `api_version` double(8,2) NOT NULL DEFAULT '0.00',
  `action` varchar(50) NOT NULL DEFAULT '',
  `latitude` varchar(50) DEFAULT NULL,
  `longitude` varchar(50) DEFAULT NULL,
  `ip` varchar(50) NOT NULL DEFAULT '',
  `country` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `url_parameter` varchar(500) NOT NULL DEFAULT '',
  `request_header` text NOT NULL,
  `request_body` text NOT NULL,
  `response_header` text,
  `response_body` text,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_app_category"
#

CREATE TABLE `qp_app_category` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `app_category` varchar(255) NOT NULL DEFAULT '',
  `sequence` int(10) NOT NULL DEFAULT '0',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_app_evalution"
#

CREATE TABLE `qp_app_evalution` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_row_id` int(10) NOT NULL DEFAULT '0',
  `app_row_id` int(10) NOT NULL DEFAULT '0',
  `version_code` int(10) NOT NULL DEFAULT '0',
  `device_type` varchar(50) NOT NULL DEFAULT '',
  `score` double(8,2) NOT NULL DEFAULT '0.00',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_app_head"
#

CREATE TABLE `qp_app_head` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `project_row_id` int(10) NOT NULL DEFAULT '0',
  `package_name` varchar(250) NOT NULL DEFAULT '',
  `default_lang_row_id` int(10) NOT NULL DEFAULT '0',
  `app_category_row_id` int(10) NOT NULL DEFAULT '0',
  `icon_url` varchar(250) NOT NULL DEFAULT '',
  `security_level` varchar(250) NOT NULL DEFAULT '',
  `sequence_level` varchar(250) NOT NULL DEFAULT '',
  `sequence` int(10) NOT NULL DEFAULT '0',
  `avg_score` mediumint(8) DEFAULT NULL,
  `security_updated_at` int(10) DEFAULT NULL,
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_app_line"
#

CREATE TABLE `qp_app_line` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `app_row_id` int(10) NOT NULL DEFAULT '0',
  `lang_row_id` int(10) NOT NULL DEFAULT '0',
  `app_name` varchar(250) NOT NULL DEFAULT '',
  `app_summary` varchar(500) NOT NULL DEFAULT '',
  `app_description` text NOT NULL,
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp(1) NOT NULL DEFAULT '0000-00-00 00:00:00.0',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_app_log"
#

CREATE TABLE `qp_app_log` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_row_id` int(10) NOT NULL DEFAULT '0',
  `app_row_id` int(10) NOT NULL DEFAULT '0',
  `page_name` varchar(50) NOT NULL DEFAULT '',
  `page_action` varchar(50) NOT NULL DEFAULT '',
  `period` varchar(50) DEFAULT NULL,
  `device_type` varchar(50) DEFAULT NULL,
  `latitude` varchar(50) DEFAULT NULL,
  `longitude` varchar(50) DEFAULT NULL,
  `ip` varchar(50) NOT NULL DEFAULT '',
  `country` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_app_pic"
#

CREATE TABLE `qp_app_pic` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `app_row_id` int(10) NOT NULL DEFAULT '0',
  `lang_row_id` int(10) NOT NULL DEFAULT '0',
  `pic_type` varchar(50) NOT NULL DEFAULT '',
  `sequence_by_type` int(10) NOT NULL DEFAULT '0',
  `pic_url` varchar(500) NOT NULL DEFAULT '',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_app_version"
#

CREATE TABLE `qp_app_version` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `app_row_id` int(10) NOT NULL DEFAULT '0',
  `version_code` int(10) NOT NULL DEFAULT '0',
  `version_name` varchar(50) NOT NULL DEFAULT '',
  `ios_url` varchar(500) DEFAULT NULL,
  `ios_ready_date` int(10) DEFAULT NULL,
  `android_url` varchar(500) DEFAULT NULL,
  `android_ready_date` int(10) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT '',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_block_list"
#

CREATE TABLE `qp_block_list` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `project_row_id` int(10) DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_error_code"
#

CREATE TABLE `qp_error_code` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `project_row_id` int(10) NOT NULL DEFAULT '0',
  `lang_row_id` int(10) NOT NULL DEFAULT '0',
  `error_code` varchar(50) NOT NULL DEFAULT '',
  `error_desc` varchar(500) NOT NULL DEFAULT '',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_group"
#

CREATE TABLE `qp_group` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(50) NOT NULL DEFAULT '',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_group_menu"
#

CREATE TABLE `qp_group_menu` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `group_row_id` int(10) NOT NULL DEFAULT '0',
  `menu_row_id` int(10) NOT NULL DEFAULT '0',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_language"
#

CREATE TABLE `qp_language` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `lang_code` varchar(5) NOT NULL DEFAULT '',
  `lang_desc` varchar(50) NOT NULL DEFAULT '',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_menu"
#

CREATE TABLE `qp_menu` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `menu_name` varchar(50) NOT NULL DEFAULT '',
  `path` varchar(500) NOT NULL DEFAULT '',
  `parent_id` int(10) NOT NULL DEFAULT '0',
  `sequence` int(10) NOT NULL DEFAULT '0',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_menu_language"
#

CREATE TABLE `qp_menu_language` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `menu_row_id` int(10) NOT NULL DEFAULT '0',
  `lang_row_id` int(10) NOT NULL DEFAULT '0',
  `menu_name` varchar(50) NOT NULL DEFAULT '',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_message"
#

CREATE TABLE `qp_message` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `message_type` varchar(50) NOT NULL DEFAULT '',
  `message_title` varchar(500) NOT NULL DEFAULT '',
  `message_text` varchar(5000) DEFAULT NULL,
  `message_html` text,
  `message_url` varchar(50) DEFAULT NULL,
  `message_source` varchar(50) NOT NULL DEFAULT '',
  `source_user_row_id` int(10) NOT NULL DEFAULT '0',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_parameter"
#

CREATE TABLE `qp_parameter` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `parameter_type_row_id` int(10) NOT NULL DEFAULT '0',
  `parameter_value` varchar(500) NOT NULL DEFAULT '',
  `created_user` int(10) DEFAULT NULL,
  `update_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_parameter_type"
#

CREATE TABLE `qp_parameter_type` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `parameter_type_name` varchar(50) NOT NULL DEFAULT '',
  `parameter_type_desc` varchar(500) DEFAULT NULL,
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_project"
#

CREATE TABLE `qp_project` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `project_code` varchar(50) NOT NULL DEFAULT '',
  `app_key` varchar(50) NOT NULL DEFAULT '',
  `secret_key` varchar(50) NOT NULL DEFAULT '',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp(1) NOT NULL DEFAULT '0000-00-00 00:00:00.0',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_push_token"
#

CREATE TABLE `qp_push_token` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `register_row_id` int(10) NOT NULL DEFAULT '0',
  `project_row_id` int(10) NOT NULL DEFAULT '0',
  `push_token` varchar(500) NOT NULL DEFAULT '',
  `device_type` varchar(50) NOT NULL DEFAULT '',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_register"
#

CREATE TABLE `qp_register` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_row_id` int(10) NOT NULL DEFAULT '0',
  `uuid` varchar(500) NOT NULL DEFAULT '',
  `device_type` varchar(50) NOT NULL DEFAULT '',
  `register_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `unregister_date` timestamp NULL DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'A',
  `remember_token` varchar(500) DEFAULT NULL,
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_role"
#

CREATE TABLE `qp_role` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `role_description` varchar(255) NOT NULL DEFAULT '',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_role_app"
#

CREATE TABLE `qp_role_app` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `role_row_id` int(10) NOT NULL DEFAULT '0',
  `app_row_id` int(10) NOT NULL DEFAULT '0',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_role_message"
#

CREATE TABLE `qp_role_message` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `project_row_id` int(10) NOT NULL DEFAULT '0',
  `user_row_id` int(10) NOT NULL DEFAULT '0',
  `message_row_id` int(10) NOT NULL DEFAULT '0',
  `need_push` varchar(1) NOT NULL DEFAULT '',
  `push_flag` varchar(1) DEFAULT NULL,
  `read_time` int(10) DEFAULT NULL,
  `deteled_at` timestamp NULL DEFAULT NULL,
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_session"
#

CREATE TABLE `qp_session` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_row_id` int(10) NOT NULL DEFAULT '0',
  `uuid` varchar(500) NOT NULL DEFAULT '',
  `token` varchar(500) NOT NULL DEFAULT '',
  `token_valid_date` int(10) DEFAULT NULL,
  `last_message_time` int(10) DEFAULT NULL,
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_user"
#

CREATE TABLE `qp_user` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `login_id` varchar(50) NOT NULL DEFAULT '',
  `emp_no` varchar(50) NOT NULL DEFAULT '',
  `emp_name` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL DEFAULT '',
  `user_domain` varchar(50) NOT NULL DEFAULT '',
  `company` varchar(50) NOT NULL DEFAULT '',
  `department` varchar(50) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT '',
  `resign` varchar(50) NOT NULL DEFAULT '',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deleted_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_user_app"
#

CREATE TABLE `qp_user_app` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_row_id` int(10) NOT NULL DEFAULT '0',
  `app_row_id` int(10) NOT NULL DEFAULT '0',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp(2) NOT NULL DEFAULT '0000-00-00 00:00:00.00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_user_group"
#

CREATE TABLE `qp_user_group` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_row_id` int(10) NOT NULL DEFAULT '0',
  `group_row_id` int(10) NOT NULL DEFAULT '0',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_user_message"
#

CREATE TABLE `qp_user_message` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `project_row_id` int(10) NOT NULL DEFAULT '0',
  `user_row_id` int(10) NOT NULL DEFAULT '0',
  `message_row_id` int(10) NOT NULL DEFAULT '0',
  `need_push` varchar(1) NOT NULL DEFAULT '',
  `push_flag` varchar(1) DEFAULT '',
  `read_time` int(10) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_user` int(1) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_user_role"
#

CREATE TABLE `qp_user_role` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_row_id` int(10) NOT NULL DEFAULT '0',
  `role_row_id` int(10) NOT NULL DEFAULT '0',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_user_score"
#

CREATE TABLE `qp_user_score` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_row_id` int(10) NOT NULL DEFAULT '0',
  `app_head_row_id` int(10) NOT NULL DEFAULT '0',
  `score` int(10) NOT NULL DEFAULT '0',
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "qp_white_list"
#

CREATE TABLE `qp_white_list` (
  `row_id` int(10) NOT NULL AUTO_INCREMENT,
  `app_row_id` int(10) NOT NULL DEFAULT '0',
  `allow_url` varchar(500) NOT NULL DEFAULT '',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_user` int(10) DEFAULT NULL,
  `updated_user` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
