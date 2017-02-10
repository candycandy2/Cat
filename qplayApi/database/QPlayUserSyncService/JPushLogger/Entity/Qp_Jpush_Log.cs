//------------------------------------------------------------------------------
// File Name   : Qp_Jpush_Log.cs
// Creator     : Moses.Zhu
// Create Date : 2017-01-11
// Description : 此代码由工具生成，请不要人为更改代码，如果重新生成代码后，这些更改将会丢失。
// Copyright (C) 2017 Qisda Corporation. All rights reserved.
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using ITS.Data;
using ITS.Data.Common;

namespace JPushLogger.Entity
{

	/// <summary>
	/// 实体类Qp_Jpush_Log
	/// </summary>
	[Serializable]
	public class Qp_Jpush_Log : ITS.Data.EntityBase
	{
		public Qp_Jpush_Log():base("qp_jpush_log") {}

		#region Model
		private int _Rowid;
		private string _Api;
		private string _Jpush_Api;
		private string _Parameter;
		private int? _Result;
		private string _Error_Message;
		private string _Error_Detail;
		private DateTime _Created_At = new DateTime();
		/// <summary>
		/// auto_increment
		/// </summary>
		public int Rowid
		{
			get{ return _Rowid; }
			set
			{
				this.OnPropertyValueChange(_.Rowid,_Rowid,value);
				this._Rowid=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Api
		{
			get{ return _Api; }
			set
			{
				this.OnPropertyValueChange(_.Api,_Api,value);
				this._Api=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Jpush_Api
		{
			get{ return _Jpush_Api; }
			set
			{
				this.OnPropertyValueChange(_.Jpush_Api,_Jpush_Api,value);
				this._Jpush_Api=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Parameter
		{
			get{ return _Parameter; }
			set
			{
				this.OnPropertyValueChange(_.Parameter,_Parameter,value);
				this._Parameter=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public int? Result
		{
			get{ return _Result; }
			set
			{
				this.OnPropertyValueChange(_.Result,_Result,value);
				this._Result=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Error_Message
		{
			get{ return _Error_Message; }
			set
			{
				this.OnPropertyValueChange(_.Error_Message,_Error_Message,value);
				this._Error_Message=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Error_Detail
		{
			get{ return _Error_Detail; }
			set
			{
				this.OnPropertyValueChange(_.Error_Detail,_Error_Detail,value);
				this._Error_Detail=value;
			}
		}
		/// <summary>
		/// on update CURRENT_TIMESTAMP
		/// </summary>
		public DateTime Created_At
		{
			get{ return _Created_At; }
			set
			{
				this.OnPropertyValueChange(_.Created_At,_Created_At,value);
				this._Created_At=value;
			}
		}
		#endregion

		#region Method
		/// <summary>
		/// 获取实体中的标识列
		/// </summary>
		public override Field GetIdentityField()
		{
			return _.Rowid;
		}
		/// <summary>
		/// 获取实体中的主键列
		/// </summary>
		public override Field[] GetPrimaryKeyFields()
		{
			return new Field[] {
				_.Rowid};
		}
		/// <summary>
		/// 获取列信息
		/// </summary>
		public override Field[] GetFields()
		{
			return new Field[] {
				_.Rowid,
				_.Api,
				_.Jpush_Api,
				_.Parameter,
				_.Result,
				_.Error_Message,
				_.Error_Detail,
				_.Created_At};
		}
		/// <summary>
		/// 获取值信息
		/// </summary>
		public override object[] GetValues()
		{
			return new object[] {
				this._Rowid,
				this._Api,
				this._Jpush_Api,
				this._Parameter,
				this._Result,
				this._Error_Message,
				this._Error_Detail,
				this._Created_At};
		}
		/// <summary>
		/// 给当前实体赋值
		/// </summary>
		public override void SetPropertyValues(IDataReader reader)
		{
			this._Rowid = DataUtils.ConvertValue<int>(reader["rowid"]);
			this._Api = DataUtils.ConvertValue<string>(reader["api"]);
			this._Jpush_Api = DataUtils.ConvertValue<string>(reader["jpush_api"]);
			this._Parameter = DataUtils.ConvertValue<string>(reader["parameter"]);
			this._Result = DataUtils.ConvertValue<int?>(reader["result"]);
			this._Error_Message = DataUtils.ConvertValue<string>(reader["error_message"]);
			this._Error_Detail = DataUtils.ConvertValue<string>(reader["error_detail"]);
			this._Created_At = DataUtils.ConvertValue<DateTime>(reader["created_at"]);
		}
		/// <summary>
		/// 给当前实体赋值
		/// </summary>
		public override void SetPropertyValues(DataRow row)
		{
			this._Rowid = DataUtils.ConvertValue<int>(row["rowid"]);
			this._Api = DataUtils.ConvertValue<string>(row["api"]);
			this._Jpush_Api = DataUtils.ConvertValue<string>(row["jpush_api"]);
			this._Parameter = DataUtils.ConvertValue<string>(row["parameter"]);
			this._Result = DataUtils.ConvertValue<int?>(row["result"]);
			this._Error_Message = DataUtils.ConvertValue<string>(row["error_message"]);
			this._Error_Detail = DataUtils.ConvertValue<string>(row["error_detail"]);
			this._Created_At = DataUtils.ConvertValue<DateTime>(row["created_at"]);
		}
		#endregion

		#region _Field
		/// <summary>
		/// 字段信息
		/// </summary>
		public class _
		{
			/// <summary>
			/// * 
			/// </summary>
			public readonly static Field All = new Field("*","qp_jpush_log");
			/// <summary>
			/// auto_increment
			/// </summary>
			public readonly static Field Rowid = new Field("rowid","qp_jpush_log",DbType.Int32,10,"auto_increment");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Api = new Field("api","qp_jpush_log",DbType.AnsiString,100,"api");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Jpush_Api = new Field("jpush_api","qp_jpush_log",DbType.AnsiString,100,"jpush_api");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Parameter = new Field("parameter","qp_jpush_log",DbType.String,255,"parameter");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Result = new Field("result","qp_jpush_log",DbType.Int32,1,"result");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Error_Message = new Field("error_message","qp_jpush_log",DbType.AnsiString,255,"error_message");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Error_Detail = new Field("error_detail","qp_jpush_log",DbType.String,255,"error_detail");
			/// <summary>
			/// on update CURRENT_TIMESTAMP
			/// </summary>
			public readonly static Field Created_At = new Field("created_at","qp_jpush_log",DbType.Binary,0,"on update CURRENT_TIMESTAMP");
		}
		#endregion


	}
}

