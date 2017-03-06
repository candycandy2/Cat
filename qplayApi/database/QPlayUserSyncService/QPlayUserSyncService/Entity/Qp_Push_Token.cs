//------------------------------------------------------------------------------
// File Name   : Qp_Push_Token.cs
// Creator     : John.ZC.Zhuang
// Create Date : 2017-03-03
// Description : 此代码由工具生成，请不要人为更改代码，如果重新生成代码后，这些更改将会丢失。
// Copyright (C) 2017 Qisda Corporation. All rights reserved.
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using ITS.Data;
using ITS.Data.Common;

namespace QPlayUserSyncService.Entity
{

	/// <summary>
	/// 实体类Qp_Push_Token
	/// </summary>
	[Serializable]
	public class Qp_Push_Token : ITS.Data.EntityBase
	{
		public Qp_Push_Token():base("qp_push_token") {}

		#region Model
		private int _Row_Id;
		private int _Register_Row_Id = 0;
		private int _Project_Row_Id = 0;
		private string _Push_Token;
		private string _Device_Type;
		private string _Created_User;
		private string _Updated_User;
		private DateTime _Created_At = DateTime.MinValue;
		private DateTime _Updated_At = DateTime.MinValue;
		/// <summary>
		/// auto_increment
		/// </summary>
		public int Row_Id
		{
			get{ return _Row_Id; }
			set
			{
				this.OnPropertyValueChange(_.Row_Id,_Row_Id,value);
				this._Row_Id=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public int Register_Row_Id
		{
			get{ return _Register_Row_Id; }
			set
			{
				this.OnPropertyValueChange(_.Register_Row_Id,_Register_Row_Id,value);
				this._Register_Row_Id=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public int Project_Row_Id
		{
			get{ return _Project_Row_Id; }
			set
			{
				this.OnPropertyValueChange(_.Project_Row_Id,_Project_Row_Id,value);
				this._Project_Row_Id=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Push_Token
		{
			get{ return _Push_Token; }
			set
			{
				this.OnPropertyValueChange(_.Push_Token,_Push_Token,value);
				this._Push_Token=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Device_Type
		{
			get{ return _Device_Type; }
			set
			{
				this.OnPropertyValueChange(_.Device_Type,_Device_Type,value);
				this._Device_Type=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Created_User
		{
			get{ return _Created_User; }
			set
			{
				this.OnPropertyValueChange(_.Created_User,_Created_User,value);
				this._Created_User=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Updated_User
		{
			get{ return _Updated_User; }
			set
			{
				this.OnPropertyValueChange(_.Updated_User,_Updated_User,value);
				this._Updated_User=value;
			}
		}
		/// <summary>
		/// 
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
		/// <summary>
		/// 
		/// </summary>
		public DateTime Updated_At
		{
			get{ return _Updated_At; }
			set
			{
				this.OnPropertyValueChange(_.Updated_At,_Updated_At,value);
				this._Updated_At=value;
			}
		}
		#endregion

		#region Method
		/// <summary>
		/// 获取实体中的标识列
		/// </summary>
		public override Field GetIdentityField()
		{
			return _.Row_Id;
		}
		/// <summary>
		/// 获取实体中的主键列
		/// </summary>
		public override Field[] GetPrimaryKeyFields()
		{
			return new Field[] {
				_.Row_Id};
		}
		/// <summary>
		/// 获取列信息
		/// </summary>
		public override Field[] GetFields()
		{
			return new Field[] {
				_.Row_Id,
				_.Register_Row_Id,
				_.Project_Row_Id,
				_.Push_Token,
				_.Device_Type,
				_.Created_User,
				_.Updated_User,
				_.Created_At,
				_.Updated_At};
		}
		/// <summary>
		/// 获取值信息
		/// </summary>
		public override object[] GetValues()
		{
			return new object[] {
				this._Row_Id,
				this._Register_Row_Id,
				this._Project_Row_Id,
				this._Push_Token,
				this._Device_Type,
				this._Created_User,
				this._Updated_User,
				this._Created_At,
				this._Updated_At};
		}
		/// <summary>
		/// 给当前实体赋值
		/// </summary>
		public override void SetPropertyValues(IDataReader reader)
		{
			this._Row_Id = DataUtils.ConvertValue<int>(reader["row_id"]);
			this._Register_Row_Id = DataUtils.ConvertValue<int>(reader["register_row_id"]);
			this._Project_Row_Id = DataUtils.ConvertValue<int>(reader["project_row_id"]);
			this._Push_Token = DataUtils.ConvertValue<string>(reader["push_token"]);
			this._Device_Type = DataUtils.ConvertValue<string>(reader["device_type"]);
			this._Created_User = DataUtils.ConvertValue<string>(reader["created_user"]);
			this._Updated_User = DataUtils.ConvertValue<string>(reader["updated_user"]);
			this._Created_At = DataUtils.ConvertValue<DateTime>(reader["created_at"]);
			this._Updated_At = DataUtils.ConvertValue<DateTime>(reader["updated_at"]);
		}
		/// <summary>
		/// 给当前实体赋值
		/// </summary>
		public override void SetPropertyValues(DataRow row)
		{
			this._Row_Id = DataUtils.ConvertValue<int>(row["row_id"]);
			this._Register_Row_Id = DataUtils.ConvertValue<int>(row["register_row_id"]);
			this._Project_Row_Id = DataUtils.ConvertValue<int>(row["project_row_id"]);
			this._Push_Token = DataUtils.ConvertValue<string>(row["push_token"]);
			this._Device_Type = DataUtils.ConvertValue<string>(row["device_type"]);
			this._Created_User = DataUtils.ConvertValue<string>(row["created_user"]);
			this._Updated_User = DataUtils.ConvertValue<string>(row["updated_user"]);
			this._Created_At = DataUtils.ConvertValue<DateTime>(row["created_at"]);
			this._Updated_At = DataUtils.ConvertValue<DateTime>(row["updated_at"]);
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
			public readonly static Field All = new Field("*","qp_push_token");
			/// <summary>
			/// auto_increment
			/// </summary>
			public readonly static Field Row_Id = new Field("row_id","qp_push_token",DbType.Int32,10,"auto_increment");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Register_Row_Id = new Field("register_row_id","qp_push_token",DbType.Int32,10,"register_row_id");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Project_Row_Id = new Field("project_row_id","qp_push_token",DbType.Int32,10,"project_row_id");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Push_Token = new Field("push_token","qp_push_token",DbType.AnsiString,250,"push_token");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Device_Type = new Field("device_type","qp_push_token",DbType.AnsiString,50,"device_type");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Created_User = new Field("created_user","qp_push_token",DbType.AnsiString,50,"created_user");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Updated_User = new Field("updated_user","qp_push_token",DbType.AnsiString,50,"updated_user");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Created_At = new Field("created_at","qp_push_token",DbType.DateTime,20,"created_at");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Updated_At = new Field("updated_at","qp_push_token",DbType.DateTime,20,"updated_at");
		}
		#endregion


	}
}

