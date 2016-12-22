//------------------------------------------------------------------------------
// File Name   : Qp_User_Flower.cs
// Creator     : Moses.Zhu
// Create Date : 2016-12-19
// Description : 此代码由工具生成，请不要人为更改代码，如果重新生成代码后，这些更改将会丢失。
// Copyright (C) 2016 Qisda Corporation. All rights reserved.
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
	/// 实体类Qp_User_Flower
	/// </summary>
	[Serializable]
	public class Qp_User_Flower : ITS.Data.EntityBase
	{
		public Qp_User_Flower():base("qp_user_flower") {}

		#region Model
		private int _Row_Id;
		private string _Emp_No;
		private string _Login_Name;
		private string _Emp_Name;
		private string _Ext_No;
		private string _Mail_Account;
		private string _Domain;
		private string _Site_Code;
		private string _Company;
		private string _Dept_Code;
		private string _Active;
		private DateTime? _Dimission_Date;
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
		public string Login_Name
		{
			get{ return _Login_Name; }
			set
			{
				this.OnPropertyValueChange(_.Login_Name,_Login_Name,value);
				this._Login_Name=value;
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
		public string Mail_Account
		{
			get{ return _Mail_Account; }
			set
			{
				this.OnPropertyValueChange(_.Mail_Account,_Mail_Account,value);
				this._Mail_Account=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Domain
		{
			get{ return _Domain; }
			set
			{
				this.OnPropertyValueChange(_.Domain,_Domain,value);
				this._Domain=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Site_Code
		{
			get{ return _Site_Code; }
			set
			{
				this.OnPropertyValueChange(_.Site_Code,_Site_Code,value);
				this._Site_Code=value;
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
		public string Dept_Code
		{
			get{ return _Dept_Code; }
			set
			{
				this.OnPropertyValueChange(_.Dept_Code,_Dept_Code,value);
				this._Dept_Code=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public string Active
		{
			get{ return _Active; }
			set
			{
				this.OnPropertyValueChange(_.Active,_Active,value);
				this._Active=value;
			}
		}
		/// <summary>
		/// 
		/// </summary>
		public DateTime? Dimission_Date
		{
			get{ return _Dimission_Date; }
			set
			{
				this.OnPropertyValueChange(_.Dimission_Date,_Dimission_Date,value);
				this._Dimission_Date=value;
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
				_.Emp_No,
				_.Login_Name,
				_.Emp_Name,
				_.Ext_No,
				_.Mail_Account,
				_.Domain,
				_.Site_Code,
				_.Company,
				_.Dept_Code,
				_.Active,
				_.Dimission_Date};
		}
		/// <summary>
		/// 获取值信息
		/// </summary>
		public override object[] GetValues()
		{
			return new object[] {
				this._Row_Id,
				this._Emp_No,
				this._Login_Name,
				this._Emp_Name,
				this._Ext_No,
				this._Mail_Account,
				this._Domain,
				this._Site_Code,
				this._Company,
				this._Dept_Code,
				this._Active,
				this._Dimission_Date};
		}
		/// <summary>
		/// 给当前实体赋值
		/// </summary>
		public override void SetPropertyValues(IDataReader reader)
		{
			this._Row_Id = DataUtils.ConvertValue<int>(reader["row_id"]);
			this._Emp_No = DataUtils.ConvertValue<string>(reader["emp_no"]);
			this._Login_Name = DataUtils.ConvertValue<string>(reader["login_name"]);
			this._Emp_Name = DataUtils.ConvertValue<string>(reader["emp_name"]);
			this._Ext_No = DataUtils.ConvertValue<string>(reader["ext_no"]);
			this._Mail_Account = DataUtils.ConvertValue<string>(reader["mail_account"]);
			this._Domain = DataUtils.ConvertValue<string>(reader["domain"]);
			this._Site_Code = DataUtils.ConvertValue<string>(reader["site_code"]);
			this._Company = DataUtils.ConvertValue<string>(reader["company"]);
			this._Dept_Code = DataUtils.ConvertValue<string>(reader["dept_code"]);
			this._Active = DataUtils.ConvertValue<string>(reader["active"]);
			this._Dimission_Date = DataUtils.ConvertValue<DateTime?>(reader["dimission_date"]);
		}
		/// <summary>
		/// 给当前实体赋值
		/// </summary>
		public override void SetPropertyValues(DataRow row)
		{
			this._Row_Id = DataUtils.ConvertValue<int>(row["row_id"]);
			this._Emp_No = DataUtils.ConvertValue<string>(row["emp_no"]);
			this._Login_Name = DataUtils.ConvertValue<string>(row["login_name"]);
			this._Emp_Name = DataUtils.ConvertValue<string>(row["emp_name"]);
			this._Ext_No = DataUtils.ConvertValue<string>(row["ext_no"]);
			this._Mail_Account = DataUtils.ConvertValue<string>(row["mail_account"]);
			this._Domain = DataUtils.ConvertValue<string>(row["domain"]);
			this._Site_Code = DataUtils.ConvertValue<string>(row["site_code"]);
			this._Company = DataUtils.ConvertValue<string>(row["company"]);
			this._Dept_Code = DataUtils.ConvertValue<string>(row["dept_code"]);
			this._Active = DataUtils.ConvertValue<string>(row["active"]);
			this._Dimission_Date = DataUtils.ConvertValue<DateTime?>(row["dimission_date"]);
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
			public readonly static Field All = new Field("*","qp_user_flower");
			/// <summary>
			/// auto_increment
			/// </summary>
			public readonly static Field Row_Id = new Field("row_id","qp_user_flower",DbType.Int32,50,"auto_increment");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Emp_No = new Field("emp_no","qp_user_flower",DbType.AnsiString,40,"emp_no");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Login_Name = new Field("login_name","qp_user_flower",DbType.AnsiString,50,"login_name");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Emp_Name = new Field("emp_name","qp_user_flower",DbType.AnsiString,50,"emp_name");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Ext_No = new Field("ext_no","qp_user_flower",DbType.AnsiString,40,"ext_no");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Mail_Account = new Field("mail_account","qp_user_flower",DbType.AnsiString,50,"mail_account");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Domain = new Field("domain","qp_user_flower",DbType.AnsiString,50,"domain");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Site_Code = new Field("site_code","qp_user_flower",DbType.AnsiString,50,"site_code");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Company = new Field("company","qp_user_flower",DbType.AnsiString,50,"company");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Dept_Code = new Field("dept_code","qp_user_flower",DbType.AnsiString,50,"dept_code");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Active = new Field("active","qp_user_flower",DbType.AnsiString,1,"active");
			/// <summary>
			/// 
			/// </summary>
			public readonly static Field Dimission_Date = new Field("dimission_date","qp_user_flower",DbType.DateTime,0,"dimission_date");
		}
		#endregion


	}
}

