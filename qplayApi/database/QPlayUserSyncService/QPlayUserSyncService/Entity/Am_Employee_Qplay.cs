//------------------------------------------------------------------------------
// File Name   : Am_Employee_Qplay.cs
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
    /// 实体类Am_Employee_Qplay
    /// </summary>
    [Serializable]
    public class Am_Employee_Qplay : ITS.Data.EntityBase
    {
        public Am_Employee_Qplay() : base("am_employee_qplay") { }

        #region Model
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

        public Qp_User_Flower GetQplayTempData()
        {
            Qp_User_Flower result = new Qp_User_Flower();
            result.Emp_No = this.Emp_No;
            result.Login_Name = this.Login_Name;
            result.Emp_Name = this.Emp_Name;
            result.Ext_No = this.Ext_No;
            result.Mail_Account = this.Mail_Account;
            result.Domain = this.Domain;
            result.Site_Code = this.Site_Code;
            result.Company = this.Company;
            result.Dept_Code = this.Dept_Code;
            result.Active = this.Active;
            result.Dimission_Date = this.Dimission_Date;
            return result;
        }

        /// <summary>
        /// 
        /// </summary>
        public string Emp_No
        {
            get { return _Emp_No; }
            set
            {
                this.OnPropertyValueChange(_.Emp_No, _Emp_No, value);
                this._Emp_No = value;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Login_Name
        {
            get { return _Login_Name; }
            set
            {
                this.OnPropertyValueChange(_.Login_Name, _Login_Name, value);
                this._Login_Name = value;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Emp_Name
        {
            get { return _Emp_Name; }
            set
            {
                this.OnPropertyValueChange(_.Emp_Name, _Emp_Name, value);
                this._Emp_Name = value;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Ext_No
        {
            get { return _Ext_No; }
            set
            {
                this.OnPropertyValueChange(_.Ext_No, _Ext_No, value);
                this._Ext_No = value;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Mail_Account
        {
            get { return _Mail_Account; }
            set
            {
                this.OnPropertyValueChange(_.Mail_Account, _Mail_Account, value);
                this._Mail_Account = value;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Domain
        {
            get { return _Domain; }
            set
            {
                this.OnPropertyValueChange(_.Domain, _Domain, value);
                this._Domain = value;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Site_Code
        {
            get { return _Site_Code; }
            set
            {
                this.OnPropertyValueChange(_.Site_Code, _Site_Code, value);
                this._Site_Code = value;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Company
        {
            get { return _Company; }
            set
            {
                this.OnPropertyValueChange(_.Company, _Company, value);
                this._Company = value;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Dept_Code
        {
            get { return _Dept_Code; }
            set
            {
                this.OnPropertyValueChange(_.Dept_Code, _Dept_Code, value);
                this._Dept_Code = value;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Active
        {
            get { return _Active; }
            set
            {
                this.OnPropertyValueChange(_.Active, _Active, value);
                this._Active = value;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? Dimission_Date
        {
            get { return _Dimission_Date; }
            set
            {
                this.OnPropertyValueChange(_.Dimission_Date, _Dimission_Date, value);
                this._Dimission_Date = value;
            }
        }
        #endregion

        #region Method
        /// <summary>
        /// 是否只读
        /// </summary>
        public override bool IsReadOnly()
        {
            return true;
        }
        /// <summary>
        /// 获取实体中的主键列
        /// </summary>
        public override Field[] GetPrimaryKeyFields()
        {
            throw new NotImplementedException("表am_employee_qplay的主键信息沒有定义，请使用EntityBuilder工具定义主键信息！");
        }
        /// <summary>
        /// 获取列信息
        /// </summary>
        public override Field[] GetFields()
        {
            return new Field[] {
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
            public readonly static Field All = new Field("*", "am_employee_qplay");
            /// <summary>
            /// 
            /// </summary>
            public readonly static Field Emp_No = new Field("emp_no", "am_employee_qplay", DbType.String, 100, "emp_no");
            /// <summary>
            /// 
            /// </summary>
            public readonly static Field Login_Name = new Field("login_name", "am_employee_qplay", DbType.String, 100, "login_name");
            /// <summary>
            /// 
            /// </summary>
            public readonly static Field Emp_Name = new Field("emp_name", "am_employee_qplay", DbType.String, 100, "emp_name");
            /// <summary>
            /// 
            /// </summary>
            public readonly static Field Ext_No = new Field("ext_no", "am_employee_qplay", DbType.String, 100, "ext_no");
            /// <summary>
            /// 
            /// </summary>
            public readonly static Field Mail_Account = new Field("mail_account", "am_employee_qplay", DbType.String, 100, "mail_account");
            /// <summary>
            /// 
            /// </summary>
            public readonly static Field Domain = new Field("domain", "am_employee_qplay", DbType.String, 100, "domain");
            /// <summary>
            /// 
            /// </summary>
            public readonly static Field Site_Code = new Field("site_code", "am_employee_qplay", DbType.String, 20, "site_code");
            /// <summary>
            /// 
            /// </summary>
            public readonly static Field Company = new Field("company", "am_employee_qplay", DbType.String, 1200, "company");
            /// <summary>
            /// 
            /// </summary>
            public readonly static Field Dept_Code = new Field("dept_code", "am_employee_qplay", DbType.AnsiString, 36, "dept_code");
            /// <summary>
            /// 
            /// </summary>
            public readonly static Field Active = new Field("active", "am_employee_qplay", DbType.AnsiString, 1, "active");
            /// <summary>
            /// 
            /// </summary>
            public readonly static Field Dimission_Date = new Field("dimission_date", "am_employee_qplay", DbType.Date, 3, "dimission_date");
        }
        #endregion


    }
}

