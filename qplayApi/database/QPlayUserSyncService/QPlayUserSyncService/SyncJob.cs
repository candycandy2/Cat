﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ITS.Data;
using QPlayUserSyncService.Entity;
using QPlayUserSyncService.DTO;

namespace QPlayUserSyncService
{
    public class SyncJob
    {
        private DbSession _dbFlowER;
        private DbSession _dbQPlay;

        public void Run()
        {
            Init();
            ImportDataIntoTempFromFlowER();
            SyncFromTemp();
        }        

        private void Init()
        {
            _dbFlowER = new DbSession("flower");
            _dbQPlay = new DbSession("qplay");
        }

        private void ImportDataIntoTempFromFlowER()
        {
            ClearTemp();
            List<Am_Employee_Qplay> flowerUserList = GetFlowerUserDataList();
            InsertTemp(flowerUserList);
        }

        private void ClearTemp()
        {
            string sql = "TRUNCATE TABLE qp_user_flower";
            _dbQPlay.FromSql(sql).ExecuteNonQuery();
        }

        private void InsertTemp(List<Am_Employee_Qplay> dataList)
        {
            List<Qp_User_Flower> qplayTempDataList = new List<Qp_User_Flower>();
            foreach (Am_Employee_Qplay data in dataList)
            {
                Qp_User_Flower user = data.GetQplayTempData();
                qplayTempDataList.Add(user);
                //_dbQPlay.Insert<Qp_User_Flower>(user);
            }
            _dbQPlay.Insert<Qp_User_Flower>(qplayTempDataList);
        }

        private List<Am_Employee_Qplay> GetFlowerUserDataList()
        {
            string sql = "select * from gbpm.am_employee_qplay";
            return _dbFlowER.FromSql(sql).ToList<Am_Employee_Qplay>();
        }        

        private void SyncFromTemp()
        {
            SyncNewUser();
            SyncActiveUser();
            SyncInactiveUser();
        }

        private void SyncNewUser()
        {
            string sql = @"
INSERT INTO qp_user (
	login_id,
	emp_no,
	emp_name,
	email,
	ext_no,
	user_domain,
	company,
	department,
	`status`,
	resign,
	created_user,
	updated_user,
	created_at,	
	updated_at,
	deleted_at
) VALUES (
	SELECT login_name,
				 emp_no,
				 emp_name,
				 email_account,
				 ext_no,
				 domain,
				 company,
				 dept_code,
				 active,
				 'Y',
				 'SyncService',
				 '',
				 now(),
				 '0000-00-00 00:00:00',
				 '0000-00-00 00:00:00'
	FROM qp_user_flower uf
 WHERE NOT EXISTS ( SELECT * FROM qp_user u WHERE u.emp_no = uf.emp_no )
)";

            _dbQPlay.FromSql(sql).ExecuteNonQuery();
        }

        private void SyncActiveUser()
        {
            string sql = @"
UPDATE qp_user 
INNER JOIN qp_user_flower ON qp_user.emp_no = qp_user_flower.emp_no
SET qp_user.login_id = qp_user_flower.login_name,
    qp_user.emp_name = qp_user_flower.emp_name,
    qp_user.email = qp_user_flower.email_account,
    qp_user.ext_no = qp_user_flower.ext_no,
    qp_user.user_domain = qp_user_flower.domain_code,
    qp_user.company = qp_user_flower.company,
    qp_user.department = qp_user_flower.dept_code,
    qp_user.status = qp_user_flower.active,
    qp_user.resign = 'N',
    qp_user.updated_at = now()
WHERE qp_user_flower.status = 'Y'";

            _dbQPlay.FromSql(sql).ExecuteNonQuery();
        }

        private void SyncInactiveUser()
        {
            string sql = @"
UPDATE qp_user
INNER JOIN qp_user_flower ON qp_user.emp_no=qp_user_flower.emp_no
SET qp_user.login_id=qp_user_flower.login_name,
    qp_user.emp_name=qp_user_flower.emp_name,
    qp_user.email=qp_user_flower.email_account,
    qp_user.ext_no=qp_user_flower.ext_no,
    qp_user.user_domain=qp_user_flower.domain,
    qp_user.company=qp_user_flower.company,
    qp_user.department=qp_user_flower.dept_code,
    qp_user.status=qp_user_flower.active,
    qp_user.resign='Y',
    qp_user.deleted_at= DATE_ADD(qp_user_flower.dimission_date,INTERVAL 8 HOUR)
    qp_user.updated_at=now()
WHERE qp_user_flower.status = 'N'";

            _dbQPlay.FromSql(sql).ExecuteNonQuery();
        }        
    }
}
