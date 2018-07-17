using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ITS.Data;
using QPlayUserSyncService.Entity;
using QPlayUserSyncService.DTO;
using System.Configuration;
using JPushProxy;

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
            string viewName = ConfigurationManager.AppSettings.Get("flower_user_view_name");
            string sql = "select * from " + viewName;
            return _dbFlowER.FromSql(sql).ToList<Am_Employee_Qplay>();
        }

        private void SyncFromTemp()
        {
            SyncNewUser();
            SyncActiveUser();
            SyncInactiveUser();
            ClearRegisterIDPushTokenSession();
        }

        /// <summary>
        /// 删除session,push_token,register_id
        /// </summary>
        private void ClearRegisterIDPushTokenSession()
        {
            try
            {
                _dbQPlay.BeginTransaction();
                //待删除user
                List<Qp_User> userInfoList = _dbQPlay.From<Qp_User>()
                    .InnerJoin<Qp_User_Flower>(Qp_User_Flower._.Emp_No == Qp_User._.Emp_No)
                    .Where(Qp_User_Flower._.Active == "N")
                    .Select(Qp_User._.All)
                    .ToList();
                //待删除register_id
                List<string> userRowIDList = userInfoList.Select(x => x.Row_Id).ToList();
                List<Qp_Register> registerList = _dbQPlay.From<Qp_Register>()
                    .Where(Qp_Register._.User_Row_Id.In(userRowIDList))
                    .Select(Qp_Register._.All)
                    .ToList();
                List<int> registerRowIDList = registerList.Select(x => x.Row_Id).ToList();

                //(1)移除Tag
                List<LoginIDRegisterIDTagDTO> tagList = new List<LoginIDRegisterIDTagDTO>();
                registerList.ForEach(x =>
                {
                    Qp_User user = userInfoList.Find(y => x.User_Row_Id == y.Row_Id);
                    if (user != null)
                    {
                        LoginIDRegisterIDTagDTO item = new LoginIDRegisterIDTagDTO();
                        item.Company = user.Company;
                        item.LoginID = user.Login_Id;
                        item.RegisterID = x.Uuid;
                        tagList.Add(item);
                    }
                });
                /*
                //Test Data
                tagList = new List<LoginIDRegisterIDTagDTO>();
                tagList.Add(new LoginIDRegisterIDTagDTO() {
                    RegisterID = "100d855909480e53421",
                    Company = "BENQ",
                    LoginID = "EEEEE",
                });
                */

                UnregisterTag(tagList);

                //(2)移除session
                _dbQPlay.Delete<Qp_Session>(Qp_Session._.User_Row_Id.In(userRowIDList));
                //(3)移除register
                _dbQPlay.Delete<Qp_Register>(Qp_Register._.Row_Id.In(registerList.Select(x => x.Row_Id).ToList()));
                //(4)移除push_token
                _dbQPlay.Delete<Qp_Push_Token>(Qp_Push_Token._.Register_Row_Id.In(registerRowIDList));

                _dbQPlay.CommitTransaction();
            }
            catch (Exception)
            {
                _dbQPlay.RollBackTransaction();
                throw;
            }

        }

        private void UnregisterTag(List<LoginIDRegisterIDTagDTO> dicRegisterIDTag)
        {
            JPushProxy.JPushProxy jpush = new JPushProxy.JPushProxy();
            foreach (var item in dicRegisterIDTag)
            {
                jpush.RemoveTag(item.RegisterID, item.Tag);
            }
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
    site_code,
	`status`,
	resign,
	created_user,
	updated_user,
	created_at
) 
	SELECT login_name as login_id,
				 emp_no,
				 emp_name,
				 mail_account as ext_no,
				 ext_no,
				 domain as user_domain,
				 company,
				 dept_code as department,
                 site_code,
				 active as `status`,
				 'Y' as resign,
				 -1 as created_user,
				 -1 as updated_user,
				 now() as created_at
	FROM qp_user_flower uf
 WHERE NOT EXISTS ( SELECT * FROM qp_user u WHERE u.emp_no = uf.emp_no )
";

            _dbQPlay.FromSql(sql).ExecuteNonQuery();
        }

        private void SyncActiveUser()
        {
            string sql = @"
UPDATE qp_user 
INNER JOIN qp_user_flower ON qp_user.emp_no = qp_user_flower.emp_no
SET qp_user.login_id = qp_user_flower.login_name,
    qp_user.emp_name = qp_user_flower.emp_name,
    qp_user.email = qp_user_flower.mail_account,
    qp_user.ext_no = qp_user_flower.ext_no,
    qp_user.user_domain = qp_user_flower.domain,
    qp_user.company = qp_user_flower.company,
    qp_user.department = qp_user_flower.dept_code,
    qp_user.site_code = qp_user_flower.site_code,
    qp_user.status = qp_user_flower.active,
    qp_user.resign = UPPER('n'),
    qp_user.updated_at = now()
WHERE qp_user_flower.active = 'Y'";

            _dbQPlay.FromSql(sql).ExecuteNonQuery();
        }

        private void SyncInactiveUser()
        {
            string sql = @"
UPDATE qp_user
INNER JOIN qp_user_flower ON qp_user.emp_no=qp_user_flower.emp_no
SET qp_user.login_id=qp_user_flower.login_name,
    qp_user.emp_name=qp_user_flower.emp_name,
    qp_user.email=qp_user_flower.mail_account,
    qp_user.ext_no=qp_user_flower.ext_no,
    qp_user.user_domain=qp_user_flower.domain,
    qp_user.company=qp_user_flower.company,
    qp_user.department=qp_user_flower.dept_code,
    qp_user.site_code = qp_user_flower.site_code,
    qp_user.status=qp_user_flower.active,
    qp_user.resign='Y',
    qp_user.deleted_at = DATE_ADD(qp_user_flower.dimission_date,INTERVAL 8 HOUR),
    qp_user.updated_at = NOW()
WHERE qp_user_flower.active = UPPER('n')";

            _dbQPlay.FromSql(sql).ExecuteNonQuery();
        }
    }
}
