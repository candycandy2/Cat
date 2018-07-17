//------------------------------------------------------------------------------
// File Name   : Qp_Register.cs
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
	/// 实体类Qp_Register
	/// </summary>
	[Serializable]
	public class Qp_Register : ITS.Data.EntityBase
	{
		public Qp_Register():base("qp_register") {}

		#region Model
		private int _Row_Id;
		private string _User_Row_Id = "0";
		private string _Uuid;
		private string _Device_Type;
		private DateTime _Register_Date = DateTime.MinValue;
		private DateTime? _Unregister_Date;
		private string _Status = "A";
		private string _Remember_Token;
		private int? _Last_Message_Time;
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
		public string User_Row_Id
		{
			get{ return _User_Row_Id; }
			set
			{
				this.OnPropertyValueChange(_.User_Row_Id,_User_Row_Id,value);
				this._User_Row_Id=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Uuid
		{
			get{ return _Uuid; }
			set
			{
				this.OnPropertyValueChange(_.Uuid,_Uuid,value);
				this._Uuid=value;
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
		public DateTime Register_Date
		{
			get{ return _Register_Date; }
			set
			{
				this.OnPropertyValueChange(_.Register_Date,_Register_Date,value);
				this._Register_Date=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public DateTime? Unregister_Date
		{
			get{ return _Unregister_Date; }
			set
			{
				this.OnPropertyValueChange(_.Unregister_Date,_Unregister_Date,value);
				this._Unregister_Date=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Status
		{
			get{ return _Status; }
			set
			{
				this.OnPropertyValueChange(_.Status,_Status,value);
				this._Status=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Remember_Token
		{
			get{ return _Remember_Token; }
			set
			{
				this.OnPropertyValueChange(_.Remember_Token,_Remember_Token,value);
				this._Remember_Token=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public int? Last_Message_Time
		{
			get{ return _Last_Message_Time; }
			set
			{
				this.OnPropertyValueChange(_.Last_Message_Time,_Last_Message_Time,value);
				this._Last_Message_Time=value;
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
				_.User_Row_Id,
				_.Uuid,
				_.Device_Type,
				_.Register_Date,
				_.Unregister_Date,
				_.Status,
				_.Remember_Token,
				_.Last_Message_Time,
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
				this._User_Row_Id,
				this._Uuid,
				this._Device_Type,
				this._Register_Date,
				this._Unregister_Date,
				this._Status,
				this._Remember_Token,
				this._Last_Message_Time,
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
			this._User_Row_Id = DataUtils.ConvertValue<string>(reader["user_row_id"]);
			this._Uuid = DataUtils.ConvertValue<string>(reader["uuid"]);
			this._Device_Type = DataUtils.ConvertValue<string>(reader["device_type"]);
			this._Register_Date = DataUtils.ConvertValue<DateTime>(reader["register_date"]);
			this._Unregister_Date = DataUtils.ConvertValue<DateTime?>(reader["unregister_date"]);
			this._Status = DataUtils.ConvertValue<string>(reader["status"]);
			this._Remember_Token = DataUtils.ConvertValue<string>(reader["remember_token"]);
			this._Last_Message_Time = DataUtils.ConvertValue<int?>(reader["last_message_time"]);
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
			this._User_Row_Id = DataUtils.ConvertValue<string>(row["user_row_id"]);
			this._Uuid = DataUtils.ConvertValue<string>(row["uuid"]);
			this._Device_Type = DataUtils.ConvertValue<string>(row["device_type"]);
			this._Register_Date = DataUtils.ConvertValue<DateTime>(row["register_date"]);
			this._Unregister_Date = DataUtils.ConvertValue<DateTime?>(row["unregister_date"]);
			this._Status = DataUtils.ConvertValue<string>(row["status"]);
			this._Remember_Token = DataUtils.ConvertValue<string>(row["remember_token"]);
			this._Last_Message_Time = DataUtils.ConvertValue<int?>(row["last_message_time"]);
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
			public readonly static Field All = new Field("*","qp_register");
			/// <summary>
			/// auto_increment
			/// </summary>
			public readonly static Field Row_Id = new Field("row_id","qp_register",DbType.Int32,10,"auto_increment");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field User_Row_Id = new Field("user_row_id","qp_register",DbType.AnsiString,50,"user_row_id");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Uuid = new Field("uuid","qp_register",DbType.AnsiString,250,"uuid");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Device_Type = new Field("device_type","qp_register",DbType.AnsiString,50,"device_type");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Register_Date = new Field("register_date","qp_register",DbType.DateTime,20,"register_date");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Unregister_Date = new Field("unregister_date","qp_register",DbType.DateTime,20,"unregister_date");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Status = new Field("status","qp_register",DbType.AnsiString,50,"status");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Remember_Token = new Field("remember_token","qp_register",DbType.AnsiString,500,"remember_token");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Last_Message_Time = new Field("last_message_time","qp_register",DbType.Int32,10,"last_message_time");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Created_User = new Field("created_user","qp_register",DbType.AnsiString,50,"created_user");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Updated_User = new Field("updated_user","qp_register",DbType.AnsiString,50,"updated_user");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Created_At = new Field("created_at","qp_register",DbType.DateTime,20,"created_at");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Updated_At = new Field("updated_at","qp_register",DbType.DateTime,20,"updated_at");
		}
		#endregion


	}
}

