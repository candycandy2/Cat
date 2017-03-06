//------------------------------------------------------------------------------
// File Name   : Qp_User.cs
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
	/// 实体类Qp_User
	/// </summary>
	[Serializable]
	public class Qp_User : ITS.Data.EntityBase
	{
		public Qp_User():base("qp_user") {}

		#region Model
		private string _Row_Id;
		private string _Login_Id;
		private string _Emp_No;
		private string _Emp_Name;
		private string _Email;
		private string _Ext_No;
		private string _User_Domain;
		private string _Company;
		private string _Department;
		private string _Status;
		private string _Resign;
		private string _Created_User;
		private string _Updated_User;
		private DateTime _Created_At = DateTime.MinValue;
		private DateTime _Updated_At = DateTime.MinValue;
		private DateTime _Deleted_At = DateTime.MinValue;
		/// <summary>
		/// 
		/// </summary>
		public string Row_Id
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
		public string Login_Id
		{
			get{ return _Login_Id; }
			set
			{
				this.OnPropertyValueChange(_.Login_Id,_Login_Id,value);
				this._Login_Id=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Emp_No
		{
			get{ return _Emp_No; }
			set
			{
				this.OnPropertyValueChange(_.Emp_No,_Emp_No,value);
				this._Emp_No=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Emp_Name
		{
			get{ return _Emp_Name; }
			set
			{
				this.OnPropertyValueChange(_.Emp_Name,_Emp_Name,value);
				this._Emp_Name=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Email
		{
			get{ return _Email; }
			set
			{
				this.OnPropertyValueChange(_.Email,_Email,value);
				this._Email=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Ext_No
		{
			get{ return _Ext_No; }
			set
			{
				this.OnPropertyValueChange(_.Ext_No,_Ext_No,value);
				this._Ext_No=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string User_Domain
		{
			get{ return _User_Domain; }
			set
			{
				this.OnPropertyValueChange(_.User_Domain,_User_Domain,value);
				this._User_Domain=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Company
		{
			get{ return _Company; }
			set
			{
				this.OnPropertyValueChange(_.Company,_Company,value);
				this._Company=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Department
		{
			get{ return _Department; }
			set
			{
				this.OnPropertyValueChange(_.Department,_Department,value);
				this._Department=value;
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
		public string Resign
		{
			get{ return _Resign; }
			set
			{
				this.OnPropertyValueChange(_.Resign,_Resign,value);
				this._Resign=value;
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
		/// <summary>
		/// 
		/// </summary>
		public DateTime Deleted_At
		{
			get{ return _Deleted_At; }
			set
			{
				this.OnPropertyValueChange(_.Deleted_At,_Deleted_At,value);
				this._Deleted_At=value;
			}
		}
		#endregion

		#region Method
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
				_.Login_Id,
				_.Emp_No,
				_.Emp_Name,
				_.Email,
				_.Ext_No,
				_.User_Domain,
				_.Company,
				_.Department,
				_.Status,
				_.Resign,
				_.Created_User,
				_.Updated_User,
				_.Created_At,
				_.Updated_At,
				_.Deleted_At};
		}
		/// <summary>
		/// 获取值信息
		/// </summary>
		public override object[] GetValues()
		{
			return new object[] {
				this._Row_Id,
				this._Login_Id,
				this._Emp_No,
				this._Emp_Name,
				this._Email,
				this._Ext_No,
				this._User_Domain,
				this._Company,
				this._Department,
				this._Status,
				this._Resign,
				this._Created_User,
				this._Updated_User,
				this._Created_At,
				this._Updated_At,
				this._Deleted_At};
		}
		/// <summary>
		/// 给当前实体赋值
		/// </summary>
		public override void SetPropertyValues(IDataReader reader)
		{
			this._Row_Id = DataUtils.ConvertValue<string>(reader["row_id"]);
			this._Login_Id = DataUtils.ConvertValue<string>(reader["login_id"]);
			this._Emp_No = DataUtils.ConvertValue<string>(reader["emp_no"]);
			this._Emp_Name = DataUtils.ConvertValue<string>(reader["emp_name"]);
			this._Email = DataUtils.ConvertValue<string>(reader["email"]);
			this._Ext_No = DataUtils.ConvertValue<string>(reader["ext_no"]);
			this._User_Domain = DataUtils.ConvertValue<string>(reader["user_domain"]);
			this._Company = DataUtils.ConvertValue<string>(reader["company"]);
			this._Department = DataUtils.ConvertValue<string>(reader["department"]);
			this._Status = DataUtils.ConvertValue<string>(reader["status"]);
			this._Resign = DataUtils.ConvertValue<string>(reader["resign"]);
			this._Created_User = DataUtils.ConvertValue<string>(reader["created_user"]);
			this._Updated_User = DataUtils.ConvertValue<string>(reader["updated_user"]);
			this._Created_At = DataUtils.ConvertValue<DateTime>(reader["created_at"]);
			this._Updated_At = DataUtils.ConvertValue<DateTime>(reader["updated_at"]);
			this._Deleted_At = DataUtils.ConvertValue<DateTime>(reader["deleted_at"]);
		}
		/// <summary>
		/// 给当前实体赋值
		/// </summary>
		public override void SetPropertyValues(DataRow row)
		{
			this._Row_Id = DataUtils.ConvertValue<string>(row["row_id"]);
			this._Login_Id = DataUtils.ConvertValue<string>(row["login_id"]);
			this._Emp_No = DataUtils.ConvertValue<string>(row["emp_no"]);
			this._Emp_Name = DataUtils.ConvertValue<string>(row["emp_name"]);
			this._Email = DataUtils.ConvertValue<string>(row["email"]);
			this._Ext_No = DataUtils.ConvertValue<string>(row["ext_no"]);
			this._User_Domain = DataUtils.ConvertValue<string>(row["user_domain"]);
			this._Company = DataUtils.ConvertValue<string>(row["company"]);
			this._Department = DataUtils.ConvertValue<string>(row["department"]);
			this._Status = DataUtils.ConvertValue<string>(row["status"]);
			this._Resign = DataUtils.ConvertValue<string>(row["resign"]);
			this._Created_User = DataUtils.ConvertValue<string>(row["created_user"]);
			this._Updated_User = DataUtils.ConvertValue<string>(row["updated_user"]);
			this._Created_At = DataUtils.ConvertValue<DateTime>(row["created_at"]);
			this._Updated_At = DataUtils.ConvertValue<DateTime>(row["updated_at"]);
			this._Deleted_At = DataUtils.ConvertValue<DateTime>(row["deleted_at"]);
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
			public readonly static Field All = new Field("*","qp_user");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Row_Id = new Field("row_id","qp_user",DbType.AnsiString,50,"row_id");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Login_Id = new Field("login_id","qp_user",DbType.AnsiString,50,"login_id");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Emp_No = new Field("emp_no","qp_user",DbType.AnsiString,50,"emp_no");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Emp_Name = new Field("emp_name","qp_user",DbType.AnsiString,50,"emp_name");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Email = new Field("email","qp_user",DbType.AnsiString,50,"email");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Ext_No = new Field("ext_no","qp_user",DbType.AnsiString,50,"ext_no");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field User_Domain = new Field("user_domain","qp_user",DbType.AnsiString,50,"user_domain");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Company = new Field("company","qp_user",DbType.AnsiString,50,"company");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Department = new Field("department","qp_user",DbType.AnsiString,50,"department");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Status = new Field("status","qp_user",DbType.AnsiString,50,"status");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Resign = new Field("resign","qp_user",DbType.AnsiString,50,"resign");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Created_User = new Field("created_user","qp_user",DbType.AnsiString,50,"created_user");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Updated_User = new Field("updated_user","qp_user",DbType.AnsiString,50,"updated_user");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Created_At = new Field("created_at","qp_user",DbType.DateTime,20,"created_at");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Updated_At = new Field("updated_at","qp_user",DbType.DateTime,20,"updated_at");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Deleted_At = new Field("deleted_at","qp_user",DbType.DateTime,8,"deleted_at");
		}
		#endregion


	}
}

