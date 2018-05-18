using Newtonsoft.Json.Linq;
using System;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Xml;

namespace ActivitiesWebService
{
    /// <summary>
    /// ActivitiesForQPlayAPI 的摘要说明
    /// 20171113
    /// Hakkinen Coding
    /// </summary>

    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class ActivitiesForQPlayAPI : System.Web.Services.WebService
    {
        string strConnString = ConfigurationManager.AppSettings["MyQisda.DataAccess.ConnectionString"];
        string strJson = "";
        string strResultCode = "";
        XmlDocument xmlDoc = new XmlDocument();

        // 活動清單列表
        [WebMethod]
        public string Activities_List(string strXml)
        {
            // 20180321 Hakkinen 開始就先設定
            SqlConnection SQLConn = new SqlConnection(strConnString);
            
            // 開啟 SQLConn
            SQLConn.Open();

            try
            {
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                    <LayoutHeader><EmployeeNo>1501005</EmployeeNo></LayoutHeader>
				*/
                #endregion

                // 設定傳入參數
                string EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText; // 員工工號

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(EmployeeNo))
                {
                    // 回傳參數陣列宣告
                    List<ActivitiesInfo> ListActivitiesInfo = new List<ActivitiesInfo>();

                    // Begin 以下為 SQL 執行程式碼

                    // 設定執行參數
                    DataTable DataTableActivitiesInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand("usp_Activities_List", SQLConn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameter 設定
                    cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@EmployeeNo"].Value = EmployeeNo;
                    cmd.ExecuteNonQuery();

                    // 設定Table取值
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTableActivitiesInfo);
                    // End 將執行後的資料存到 DataTableMyActivitiesInfo

                    // 判斷Table是否有值
                    if (DataTableActivitiesInfo != null && DataTableActivitiesInfo.Rows.Count > 0)
                    {
                        for (int i = 0; i < DataTableActivitiesInfo.Rows.Count; i++)
                        {
                            ActivitiesInfo ActivitiesInfo = new ActivitiesInfo();
                            ActivitiesInfo.ActivitiesID = (int)DataTableActivitiesInfo.Rows[i]["ActivitiesID"];
                            ActivitiesInfo.ActivitiesName = DataTableActivitiesInfo.Rows[i]["ActivitiesName"].ToString().Trim();
                            ActivitiesInfo.ActivitiesImage = DataTableActivitiesInfo.Rows[i]["ActivitiesImage"].ToString().Trim();
                            ActivitiesInfo.QuotaPlaces = (int)DataTableActivitiesInfo.Rows[i]["QuotaPlaces"];
                            ActivitiesInfo.RemainingPlaces = (int)DataTableActivitiesInfo.Rows[i]["RemainingPlaces"];
                            ActivitiesInfo.SignupDate = DataTableActivitiesInfo.Rows[i]["SignupDate"].ToString().Trim();
                            ActivitiesInfo.ActivitiesStatus = DataTableActivitiesInfo.Rows[i]["ActivitiesStatus"].ToString().Trim();
                            ActivitiesInfo.SignupModel = (int)DataTableActivitiesInfo.Rows[i]["SignupModel"];
                            ListActivitiesInfo.Add(ActivitiesInfo);
                        }

                        // 將資料存入 Json 格式
                        strJson = new JObject(
                                      new JProperty("ResultCode", "1"),
                                      new JProperty("Content",
                                          new JArray(
                            //使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                              from p in ListActivitiesInfo
                                              select new JObject(
                                                         new JProperty("ActivitiesID", p.ActivitiesID),
                                                         new JProperty("ActivitiesName", p.ActivitiesName.ToString().Trim()),
                                                         new JProperty("ActivitiesImage", p.ActivitiesImage.ToString().Trim()),
                                                         new JProperty("QuotaPlaces", p.QuotaPlaces),
                                                         new JProperty("RemainingPlaces", p.RemainingPlaces),
                                                         new JProperty("SignupDate", p.SignupDate.ToString().Trim()),
                                                         new JProperty("ActivitiesStatus", p.ActivitiesStatus.ToString().Trim()),
                                                         new JProperty("SignupModel", p.SignupModel)
                                              )
                                          )
                                      )
                                  ).ToString();

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 1 - 成功";
                          
                    }
                    else
                    {
                        // 查無活動資料
                        strJson = new JObject(
                                      new JProperty("ResultCode", "045901"),
                                      new JProperty("Content", "")
                                  ).ToString();

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 045901 - 查無活動資料";
                    }
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                  new JProperty("ResultCode", "999001"),
                                  new JProperty("Content", "")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 999001 - 傳入參數不足或傳入參數格式錯誤";

                }
            }
            catch (Exception ex)
            {
                strJson = ex.Message.ToString();
                
                // 20180321 Hakkinen Add ResultCode
                strResultCode = "ResultCode : Exception - " + ex.Message.ToString();
            }

            // 20180321 Hakkinen Insert System Log Begin -----------------------------------------------
            SqlCommand cmdForSystemLog = new SqlCommand("usp_Activities_SystemLog", SQLConn);
            cmdForSystemLog.CommandType = CommandType.StoredProcedure;

            // Parameter Add
            cmdForSystemLog.Parameters.Add("@Log_AppName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_AppName"].Value = "Activitie";
            cmdForSystemLog.Parameters.Add("@Log_FunctionName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_FunctionName"].Value = "Activities_List";
            cmdForSystemLog.Parameters.Add("@Log_Desc", SqlDbType.NVarChar, 3000);
            cmdForSystemLog.Parameters["@Log_Desc"].Value = strResultCode;
            cmdForSystemLog.ExecuteNonQuery();
            // 20180321 Hakkinen Insert System Log End -------------------------------------------------

            // 關閉連結 SQLConn
            SQLConn.Close();

            return strJson;
        }

        // 活動詳情內容
        [WebMethod]
        public string Activities_Detail(string strXml)
        {
            // 20180321 Hakkinen 開始就先設定
            SqlConnection SQLConn = new SqlConnection(strConnString);
            
            // 開啟 SQLConn
            SQLConn.Open();

            try
            {
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                    <LayoutHeader><ActivitiesID>2052</ActivitiesID><EmployeeNo>1501005</EmployeeNo></LayoutHeader>
				*/
                #endregion

                // 設定傳入參數
                string ActivitiesID = xmlDoc.SelectSingleNode("//ActivitiesID").InnerText; // 活動編碼
                string EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText; // 員工工號

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(ActivitiesID) && !string.IsNullOrEmpty(EmployeeNo))
                {
                    // 回傳參數陣列宣告
                    List<ActivitiesDetailInfo> ListActivitiesDetailInfo = new List<ActivitiesDetailInfo>();

                    // Begin 以下為 SQL 執行程式碼

                    // 設定執行參數
                    DataTable DataTableActivitiesDetailInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand("usp_Activities_Detail", SQLConn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameter 設定
                    cmd.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                    cmd.Parameters["@ActivitiesID"].Value = ActivitiesID;
                    cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@EmployeeNo"].Value = EmployeeNo;
                    cmd.ExecuteNonQuery();

                    // 設定Table取值
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTableActivitiesDetailInfo);
                    // End 將執行後的資料存到 DataTableMyActivitiesDetailInfo

                    // 判斷Table是否有值
                    if (DataTableActivitiesDetailInfo != null && DataTableActivitiesDetailInfo.Rows.Count > 0)
                    {
                        for (int i = 0; i < DataTableActivitiesDetailInfo.Rows.Count; i++)
                        {
                            ActivitiesDetailInfo ActivitiesDetailInfo = new ActivitiesDetailInfo();
                            ActivitiesDetailInfo.ActivitiesID = (int)DataTableActivitiesDetailInfo.Rows[i]["ActivitiesID"];
                            ActivitiesDetailInfo.ActivitiesName = DataTableActivitiesDetailInfo.Rows[i]["ActivitiesName"].ToString().Trim();
                            ActivitiesDetailInfo.ActivitiesImage = DataTableActivitiesDetailInfo.Rows[i]["ActivitiesImage"].ToString().Trim();
                            ActivitiesDetailInfo.ActivitiesContent = DataTableActivitiesDetailInfo.Rows[i]["ActivitiesContent"].ToString().Trim().Replace("http://myqisda.qgroup.corp.com/", "http://www.myqisda.com/");
                            ActivitiesDetailInfo.SignupModel = (int)DataTableActivitiesDetailInfo.Rows[i]["SignupModel"];
                            ActivitiesDetailInfo.SignupDate = DataTableActivitiesDetailInfo.Rows[i]["SignupDate"].ToString().Trim();
                            ActivitiesDetailInfo.Deadline = DataTableActivitiesDetailInfo.Rows[i]["Deadline"].ToString().Trim();
                            ActivitiesDetailInfo.QuotaPlaces = (int)DataTableActivitiesDetailInfo.Rows[i]["QuotaPlaces"];
                            ActivitiesDetailInfo.ActivitiesPlaces =(int)DataTableActivitiesDetailInfo.Rows[i]["ActivitiesPlaces"];
                            ActivitiesDetailInfo.LimitPlaces = (int)DataTableActivitiesDetailInfo.Rows[i]["LimitPlaces"];
                            ActivitiesDetailInfo.SignupPlaces = (int)DataTableActivitiesDetailInfo.Rows[i]["SignupPlaces"];
                            ActivitiesDetailInfo.IsSignup = DataTableActivitiesDetailInfo.Rows[i]["IsSignup"].ToString().Trim();
                            ActivitiesDetailInfo.IsRepeatSignup = DataTableActivitiesDetailInfo.Rows[i]["IsRepeatSignup"].ToString().Trim();
                            ActivitiesDetailInfo.IsFull = DataTableActivitiesDetailInfo.Rows[i]["IsFull"].ToString().Trim();
                            ListActivitiesDetailInfo.Add(ActivitiesDetailInfo);
                        }

                        // 將資料存入 Json 格式
                        strJson = new JObject(
                                      new JProperty("ResultCode", "1"),
                                      new JProperty("Content",
                                          new JArray(
                            //使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                              from p in ListActivitiesDetailInfo
                                              select new JObject(
                                                         new JProperty("ActivitiesID", p.ActivitiesID),
                                                         new JProperty("ActivitiesName", p.ActivitiesName.ToString().Trim()),
                                                         new JProperty("ActivitiesImage", p.ActivitiesImage.ToString().Trim()),
                                                         new JProperty("ActivitiesContent", p.ActivitiesContent.ToString().Trim()),
                                                         new JProperty("SignupModel", p.SignupModel),
                                                         new JProperty("SignupDate", p.SignupDate.ToString().Trim()),
                                                         new JProperty("Deadline", p.Deadline.ToString().Trim()),
                                                         new JProperty("QuotaPlaces", p.QuotaPlaces),
                                                         new JProperty("ActivitiesPlaces", p.ActivitiesPlaces),
                                                         new JProperty("LimitPlaces", p.LimitPlaces),
                                                         new JProperty("SignupPlaces", p.SignupPlaces),
                                                         new JProperty("IsSignup", p.IsSignup.ToString().Trim()),
                                                         new JProperty("IsRepeatSignup", p.IsRepeatSignup.ToString().Trim()),
                                                         new JProperty("IsFull", p.IsFull.ToString().Trim())
                                              )
                                          )
                                      )
                                  ).ToString();

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 1 - 成功";
                    }
                    else
                    {
                        // 查無活動資料
                        strJson = new JObject(
                                      new JProperty("ResultCode", "045901"),
                                      new JProperty("Content", "")
                                  ).ToString();

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 045901 - 查無活動資料";
                    }
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                  new JProperty("ResultCode", "999001"),
                                  new JProperty("Content", "")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 999001 - 傳入參數不足或傳入參數格式錯誤";
                }
            }
            catch (Exception ex)
            {
                strJson = ex.Message.ToString();

                // 20180321 Hakkinen Add ResultCode
                strResultCode = "ResultCode : Exception - " + ex.Message.ToString();
            }

            // 20180321 Hakkinen Insert System Log Begin -----------------------------------------------
            SqlCommand cmdForSystemLog = new SqlCommand("usp_Activities_SystemLog", SQLConn);
            cmdForSystemLog.CommandType = CommandType.StoredProcedure;

            // Parameter Add
            cmdForSystemLog.Parameters.Add("@Log_AppName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_AppName"].Value = "Activitie";
            cmdForSystemLog.Parameters.Add("@Log_FunctionName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_FunctionName"].Value = "Activities_Detail";
            cmdForSystemLog.Parameters.Add("@Log_Desc", SqlDbType.NVarChar, 3000);
            cmdForSystemLog.Parameters["@Log_Desc"].Value = strResultCode;
            cmdForSystemLog.ExecuteNonQuery();
            // 20180321 Hakkinen Insert System Log End -------------------------------------------------

            // 關閉連結 SQLConn
            SQLConn.Close();

            return strJson;
        }

        // 家屬清單列表
        [WebMethod]
        public string Activities_Family(string strXml)
        {
            // 20180321 Hakkinen 開始就先設定
            SqlConnection SQLConn = new SqlConnection(strConnString);

            // 開啟 SQLConn
            SQLConn.Open();

            try
            {
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                    <LayoutHeader><EmployeeNo>0006020</EmployeeNo></LayoutHeader>
				*/
                #endregion

                // 設定傳入參數
                string EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText; // 員工工號

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(EmployeeNo))
                {
                    // 回傳參數陣列宣告
                    List<MyFamilyInfo> ListMyFamilyInfo = new List<MyFamilyInfo>();

                    // Begin 以下為 SQL 執行程式碼

                    // 設定執行參數
                    DataTable DataTableMyFamilyInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand("usp_Activities_Family", SQLConn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameter 設定
                    cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@EmployeeNo"].Value = EmployeeNo;
                    cmd.ExecuteNonQuery();

                    // 設定Table取值
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTableMyFamilyInfo);
                    // End 將執行後的資料存到 DataTableMyFamilyInfo

                    // 判斷Table是否有值
                    if (DataTableMyFamilyInfo != null && DataTableMyFamilyInfo.Rows.Count > 0)
                    {
                        for (int i = 0; i < DataTableMyFamilyInfo.Rows.Count; i++)
                        {
                            MyFamilyInfo MyFamilyInfo = new MyFamilyInfo();
                            MyFamilyInfo.FamilyNo = (int)DataTableMyFamilyInfo.Rows[i]["FamilyNo"];
                            MyFamilyInfo.FamilyID = DataTableMyFamilyInfo.Rows[i]["FamilyID"].ToString().Trim();
                            MyFamilyInfo.FamilyName = DataTableMyFamilyInfo.Rows[i]["FamilyName"].ToString().Trim();
                            MyFamilyInfo.FamilyGender = (int)DataTableMyFamilyInfo.Rows[i]["FamilyGender"];
                            MyFamilyInfo.GenderDesc = DataTableMyFamilyInfo.Rows[i]["GenderDesc"].ToString().Trim();
                            MyFamilyInfo.FamilyRelationship = (int)DataTableMyFamilyInfo.Rows[i]["FamilyRelationship"];
                            MyFamilyInfo.RelationshipDesc = DataTableMyFamilyInfo.Rows[i]["RelationshipDesc"].ToString().Trim();
                            MyFamilyInfo.FamilyBirthday = DataTableMyFamilyInfo.Rows[i]["FamilyBirthday"].ToString().Trim();
                            MyFamilyInfo.IsActivities = DataTableMyFamilyInfo.Rows[i]["IsActivities"].ToString().Trim();
                            MyFamilyInfo.FamilyRemark = DataTableMyFamilyInfo.Rows[i]["FamilyRemark"].ToString().Trim();
                            ListMyFamilyInfo.Add(MyFamilyInfo);
                        }

                        // 將資料存入 Json 格式
                        strJson = new JObject(
                                      new JProperty("ResultCode", "1"),
                                      new JProperty("Content",
                                          new JArray(
                            //使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                              from p in ListMyFamilyInfo
                                              select new JObject(
                                                         new JProperty("FamilyNo", p.FamilyNo),
                                                         new JProperty("FamilyID", p.FamilyID.ToString().Trim()),
                                                         new JProperty("FamilyName", p.FamilyName.ToString().Trim()),
                                                         new JProperty("FamilyGender", p.FamilyGender),
                                                         new JProperty("GenderDesc", p.GenderDesc.ToString().Trim()),
                                                         new JProperty("FamilyRelationship", p.FamilyRelationship),
                                                         new JProperty("RelationshipDesc", p.RelationshipDesc.ToString().Trim()),
                                                         new JProperty("FamilyBirthday", p.FamilyBirthday.ToString().Trim()),
                                                         new JProperty("IsActivities", p.IsActivities.ToString().Trim()),
                                                         new JProperty("FamilyRemark", p.FamilyRemark.ToString().Trim())
                                              )
                                          )
                                      )
                                  ).ToString();

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 1 - 成功";
                    }
                    else
                    {
                        // 查無眷屬資料
                        strJson = new JObject(
                                      new JProperty("ResultCode", "045902"),
                                      new JProperty("Content", "")
                                  ).ToString();

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 045902 - 查無眷屬資料";
                    }
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                  new JProperty("ResultCode", "999001"),
                                  new JProperty("Content", "")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 999001 - 傳入參數不足或傳入參數格式錯誤";
                }
            }
            catch (Exception ex)
            {
                strJson = ex.Message.ToString();

                // 20180321 Hakkinen Add ResultCode
                strResultCode = "ResultCode : Exception - " + ex.Message.ToString();
            }

            // 20180321 Hakkinen Insert System Log Begin -----------------------------------------------
            SqlCommand cmdForSystemLog = new SqlCommand("usp_Activities_SystemLog", SQLConn);
            cmdForSystemLog.CommandType = CommandType.StoredProcedure;

            // Parameter Add
            cmdForSystemLog.Parameters.Add("@Log_AppName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_AppName"].Value = "Activitie";
            cmdForSystemLog.Parameters.Add("@Log_FunctionName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_FunctionName"].Value = "Activities_Family";
            cmdForSystemLog.Parameters.Add("@Log_Desc", SqlDbType.NVarChar, 3000);
            cmdForSystemLog.Parameters["@Log_Desc"].Value = strResultCode;
            cmdForSystemLog.ExecuteNonQuery();
            // 20180321 Hakkinen Insert System Log End -------------------------------------------------

            // 關閉連結 SQLConn
            SQLConn.Close();

            return strJson;
        }

        // 新增家屬資料
        [WebMethod]
        public string Activities_Family_Add(string strXml)
        {
            // 20180321 Hakkinen 開始就先設定
            SqlConnection SQLConn = new SqlConnection(strConnString);

            // 開啟 SQLConn
            SQLConn.Open();

            try
            {
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                   <LayoutHeader>
                    <EmployeeNo>1501005</EmployeeNo>
                    <FamilyID>H123456789</FamilyID>
                    <FamilyName>巴嘎冏</FamilyName>
                    <FamilyGender>1</FamilyGender>
                    <FamilyRelationship>9</FamilyRelationship>
                    <FamilyBirthday>19880214</FamilyBirthday>
                   </LayoutHeader>
				*/
                #endregion

                // 設定傳入參數
                string EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText; // 員工工號
                string FamilyID = xmlDoc.SelectSingleNode("//FamilyID").InnerText; // 家屬身分證
                string FamilyName = xmlDoc.SelectSingleNode("//FamilyName").InnerText; // 家屬姓名
                int FamilyGender = Convert.ToInt16(xmlDoc.SelectSingleNode("//FamilyGender").InnerText.Trim()); // 家屬性別編碼
                FamilyGender = (FamilyGender != 1 && FamilyGender != 0) ? 1 : FamilyGender; // 判斷家屬編碼不為0或1時, 給預設值為1
                int FamilyRelationship = Convert.ToInt16(xmlDoc.SelectSingleNode("//FamilyRelationship").InnerText.Trim()); // 家屬關係編碼
                FamilyRelationship = (FamilyRelationship > 9 || FamilyRelationship == 0) ? 1 : FamilyRelationship; // 判斷家屬編碼不為1到9或為0時, 給預設值為1
                string FamilyBirthday = xmlDoc.SelectSingleNode("//FamilyBirthday").InnerText; // 家屬生日

                // 判斷傳入參數是否為空值 ( FamilyGender 和 FamilyRelationship 兩個參數在 Try Catch 為空值或 Null 會報錯 )
                if (!string.IsNullOrEmpty(EmployeeNo) && !string.IsNullOrEmpty(FamilyID) && !string.IsNullOrEmpty(FamilyName) && !string.IsNullOrEmpty(FamilyBirthday))
                {
                    // Begin 以下為 SQL 執行程式碼

                    // 設定執行參數
                    DataTable DataTableMyFamilyInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand("usp_Activities_Family_Add", SQLConn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameter 設定
                    cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@EmployeeNo"].Value = EmployeeNo;
                    cmd.Parameters.Add("@FamilyID", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@FamilyID"].Value = FamilyID;
                    cmd.Parameters.Add("@FamilyName", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@FamilyName"].Value = FamilyName;
                    cmd.Parameters.Add("@FamilyGender", SqlDbType.NVarChar);
                    cmd.Parameters["@FamilyGender"].Value = FamilyGender.ToString().Trim();
                    cmd.Parameters.Add("@FamilyRelationship", SqlDbType.Int);
                    cmd.Parameters["@FamilyRelationship"].Value = FamilyRelationship;
                    cmd.Parameters.Add("@FamilyBirthday", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@FamilyBirthday"].Value = FamilyBirthday;
                    cmd.ExecuteNonQuery();

                    // 新增眷屬資料成功
                    strJson = new JObject(
                                  new JProperty("ResultCode", "045903")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 045903 - 新增眷屬資料成功";
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                  new JProperty("ResultCode", "999001"),
                                  new JProperty("Content", "")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 999001 - 傳入參數不足或傳入參數格式錯誤";
                }
            }
            catch (Exception ex)
            {
                // 新增眷屬資料失敗
                strJson = new JObject(
                              new JProperty("ResultCode", "045904"),
                              new JProperty("Content", ex.Message.ToString())
                          ).ToString();

                // 20180321 Hakkinen Add ResultCode
                strResultCode = "ResultCode : 045904 - 新增眷屬資料失敗, " + ex.Message.ToString();
            }

            // 20180321 Hakkinen Insert System Log Begin -----------------------------------------------
            SqlCommand cmdForSystemLog = new SqlCommand("usp_Activities_SystemLog", SQLConn);
            cmdForSystemLog.CommandType = CommandType.StoredProcedure;

            // Parameter Add
            cmdForSystemLog.Parameters.Add("@Log_AppName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_AppName"].Value = "Activitie";
            cmdForSystemLog.Parameters.Add("@Log_FunctionName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_FunctionName"].Value = "Activities_Family_Add";
            cmdForSystemLog.Parameters.Add("@Log_Desc", SqlDbType.NVarChar, 3000);
            cmdForSystemLog.Parameters["@Log_Desc"].Value = strResultCode;
            cmdForSystemLog.ExecuteNonQuery();
            // 20180321 Hakkinen Insert System Log End -------------------------------------------------

            // 關閉連結 SQLConn
            SQLConn.Close();

            return strJson;
        }

        // 更新家屬資料
        [WebMethod]
        public string Activities_Family_Update(string strXml)
        {
            // 20180321 Hakkinen 開始就先設定
            SqlConnection SQLConn = new SqlConnection(strConnString);

            // 開啟 SQLConn
            SQLConn.Open();

            try
            {
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                   <LayoutHeader>
                    <EmployeeNo>1501005</EmployeeNo>
                    <FamilyNo>41301</FamilyNo>
                    <FamilyID>H123111111</FamilyID>
                    <FamilyName>巴嘎冏</FamilyName>
                    <FamilyGender>3</FamilyGender>
                    <FamilyRelationship>2</FamilyRelationship>
                    <FamilyBirthday>19880216</FamilyBirthday>
                   </LayoutHeader>
				*/
                #endregion

                // 設定傳入參數
                string EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText; // 員工工號
                int FamilyNo = Convert.ToInt32(xmlDoc.SelectSingleNode("//FamilyNo").InnerText.Trim()); // 家屬編碼
                string FamilyID = xmlDoc.SelectSingleNode("//FamilyID").InnerText; // 家屬身分證
                int FamilyGender = Convert.ToInt16(xmlDoc.SelectSingleNode("//FamilyGender").InnerText.Trim()); // 家屬性別編碼
                FamilyGender = (FamilyGender != 1 && FamilyGender != 0) ? 0 : FamilyGender; // 判斷家屬編碼不為0或1時, 給預設值為1
                int FamilyRelationship = Convert.ToInt16(xmlDoc.SelectSingleNode("//FamilyRelationship").InnerText.Trim()); // 家屬關係編碼
                FamilyRelationship = (FamilyRelationship > 9 || FamilyRelationship == 0) ? 1 : FamilyRelationship; // 判斷家屬編碼不為1到9或為0時, 給預設值為1
                string FamilyBirthday = xmlDoc.SelectSingleNode("//FamilyBirthday").InnerText; // 家屬生日

                // 判斷傳入參數是否為空值 ( FamilyNo, FamilyGender 和 FamilyRelationship 三個參數在 Try Catch 為空值或 Null 會報錯 )
                if (!string.IsNullOrEmpty(EmployeeNo) && !string.IsNullOrEmpty(FamilyID) && !string.IsNullOrEmpty(FamilyBirthday))
                {
                    // Begin 以下為 SQL 執行程式碼

                    // 設定執行參數
                    DataTable DataTableMyFamilyInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand("usp_Activities_Family_Update", SQLConn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameter 設定
                    cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@EmployeeNo"].Value = EmployeeNo;
                    cmd.Parameters.Add("@FamilyNo", SqlDbType.Int);
                    cmd.Parameters["@FamilyNo"].Value = FamilyNo;
                    cmd.Parameters.Add("@FamilyID", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@FamilyID"].Value = FamilyID;
                    cmd.Parameters.Add("@FamilyGender", SqlDbType.NVarChar);
                    cmd.Parameters["@FamilyGender"].Value = FamilyGender.ToString().Trim();
                    cmd.Parameters.Add("@FamilyRelationship", SqlDbType.Int);
                    cmd.Parameters["@FamilyRelationship"].Value = FamilyRelationship;
                    cmd.Parameters.Add("@FamilyBirthday", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@FamilyBirthday"].Value = FamilyBirthday;
                    cmd.ExecuteNonQuery();

                    // 更新眷屬資料成功
                    strJson = new JObject(
                                  new JProperty("ResultCode", "045905")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 045905 - 更新眷屬資料成功";
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                  new JProperty("ResultCode", "999001"),
                                  new JProperty("Content", "")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 999001 - 傳入參數不足或傳入參數格式錯誤";
                }
            }
            catch (Exception ex)
            {
                // 更新眷屬資料失敗
                strJson = new JObject(
                              new JProperty("ResultCode", "045906"),
                              new JProperty("Content", ex.Message.ToString())
                          ).ToString();

                // 20180321 Hakkinen Add ResultCode
                strResultCode = "ResultCode : 045906 - 更新眷屬資料失敗, " + ex.Message.ToString();
            }

            // 20180321 Hakkinen Insert System Log Begin -----------------------------------------------
            SqlCommand cmdForSystemLog = new SqlCommand("usp_Activities_SystemLog", SQLConn);
            cmdForSystemLog.CommandType = CommandType.StoredProcedure;

            // Parameter Add
            cmdForSystemLog.Parameters.Add("@Log_AppName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_AppName"].Value = "Activitie";
            cmdForSystemLog.Parameters.Add("@Log_FunctionName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_FunctionName"].Value = "Activities_Family_Update";
            cmdForSystemLog.Parameters.Add("@Log_Desc", SqlDbType.NVarChar, 3000);
            cmdForSystemLog.Parameters["@Log_Desc"].Value = strResultCode;
            cmdForSystemLog.ExecuteNonQuery();
            // 20180321 Hakkinen Insert System Log End -------------------------------------------------

            // 關閉連結 SQLConn
            SQLConn.Close();

            return strJson;
        }

        // 刪除家屬資料
        [WebMethod]
        public string Activities_Family_Delete(string strXml)
        {
            // 20180321 Hakkinen 開始就先設定
            SqlConnection SQLConn = new SqlConnection(strConnString);

            // 開啟 SQLConn
            SQLConn.Open();

            try
            {
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                   <LayoutHeader>
                     <EmployeeNo>1501005</EmployeeNo>
                     <FamilyNo>41301</FamilyNo>
                   </LayoutHeader>
				*/
                #endregion

                // 設定傳入參數
                string EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText; // 員工工號
                int FamilyNo = Convert.ToInt32(xmlDoc.SelectSingleNode("//FamilyNo").InnerText.Trim()); // 家屬編碼

                // 判斷傳入參數是否為空值 ( FamilyNo 此個參數在 Try Catch 為空值或 Null 會報錯 )
                if (!string.IsNullOrEmpty(EmployeeNo))
                {
                    // Begin 以下為 SQL 執行程式碼

                    // 設定執行參數
                    DataTable DataTableMyFamilyInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand("usp_Activities_Family_Delete", SQLConn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameter 設定
                    cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@EmployeeNo"].Value = EmployeeNo;
                    cmd.Parameters.Add("@FamilyNo", SqlDbType.Int);
                    cmd.Parameters["@FamilyNo"].Value = FamilyNo;
                    cmd.ExecuteNonQuery();

                    // 刪除眷屬資料成功
                    strJson = new JObject(
                                  new JProperty("ResultCode", "045907")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 045907 - 刪除眷屬資料成功";
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                  new JProperty("ResultCode", "999001"),
                                  new JProperty("Content", "")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 999001 - 傳入參數不足或傳入參數格式錯誤";
                }
            }
            catch (Exception ex)
            {
                // 刪除眷屬資料失敗
                strJson = new JObject(
                              new JProperty("ResultCode", "045908"),
                              new JProperty("Content", ex.Message.ToString())
                          ).ToString();

                // 20180321 Hakkinen Add ResultCode
                strResultCode = "ResultCode : 045908 - 刪除眷屬資料失敗, " + ex.Message.ToString();
            }

            // 20180321 Hakkinen Insert System Log Begin -----------------------------------------------
            SqlCommand cmdForSystemLog = new SqlCommand("usp_Activities_SystemLog", SQLConn);
            cmdForSystemLog.CommandType = CommandType.StoredProcedure;

            // Parameter Add
            cmdForSystemLog.Parameters.Add("@Log_AppName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_AppName"].Value = "Activitie";
            cmdForSystemLog.Parameters.Add("@Log_FunctionName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_FunctionName"].Value = "Activities_Family_Delete";
            cmdForSystemLog.Parameters.Add("@Log_Desc", SqlDbType.NVarChar, 3000);
            cmdForSystemLog.Parameters["@Log_Desc"].Value = strResultCode;
            cmdForSystemLog.ExecuteNonQuery();
            // 20180321 Hakkinen Insert System Log End -------------------------------------------------

            // 關閉連結 SQLConn
            SQLConn.Close();

            return strJson;
        }

        // 已報名資訊
        [WebMethod]
        public string Activities_Record(string strXml)
        {
            // 20180321 Hakkinen 開始就先設定
            SqlConnection SQLConn = new SqlConnection(strConnString);

            // 開啟 SQLConn
            SQLConn.Open();

            try
            {
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                    <LayoutHeader><EmployeeNo>1501005</EmployeeNo></LayoutHeader>
				*/
                #endregion

                // 設定傳入參數
                string EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText; // 員工工號

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(EmployeeNo))
                {
                    // 回傳參數陣列宣告
                    List<ActivitiesRecordInfo> ListActivitiesRecordInfo = new List<ActivitiesRecordInfo>();

                    // Begin 以下為 SQL 執行程式碼

                    // 設定執行參數
                    DataTable DataTableActivitiesRecordInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand("usp_Activities_Record", SQLConn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameter 設定
                    cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@EmployeeNo"].Value = EmployeeNo;
                    cmd.ExecuteNonQuery();

                    // 設定Table取值
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTableActivitiesRecordInfo);
                    // End 將執行後的資料存到 DataTableActivitiesSignupInfo

                    // 判斷Table是否有值
                    if (DataTableActivitiesRecordInfo != null && DataTableActivitiesRecordInfo.Rows.Count > 0)
                    {
                        for (int i = 0; i < DataTableActivitiesRecordInfo.Rows.Count; i++)
                        {
                            ActivitiesRecordInfo ActivitiesRecordInfo = new ActivitiesRecordInfo();
                            ActivitiesRecordInfo.ActivitiesID = (int)DataTableActivitiesRecordInfo.Rows[i]["ActivitiesID"];
                            ActivitiesRecordInfo.ActivitiesName = DataTableActivitiesRecordInfo.Rows[i]["ActivitiesName"].ToString().Trim();
                            ActivitiesRecordInfo.SignupNo = (Int64)DataTableActivitiesRecordInfo.Rows[i]["SignupNo"];
                            ActivitiesRecordInfo.SignupModel = DataTableActivitiesRecordInfo.Rows[i]["SignupModel"].ToString().Trim();
                            ActivitiesRecordInfo.EmployeeNo = DataTableActivitiesRecordInfo.Rows[i]["EmployeeNo"].ToString().Trim();
                            ActivitiesRecordInfo.SignupName = DataTableActivitiesRecordInfo.Rows[i]["SignupName"].ToString().Trim();
                            ActivitiesRecordInfo.SignupPlaces = (int)DataTableActivitiesRecordInfo.Rows[i]["SignupPlaces"];
                            ActivitiesRecordInfo.SignupRelationship = DataTableActivitiesRecordInfo.Rows[i]["SignupRelationship"].ToString().Trim();
                            ActivitiesRecordInfo.CanCancel = DataTableActivitiesRecordInfo.Rows[i]["CanCancel"].ToString().Trim();
                            ActivitiesRecordInfo.SignupTime = DataTableActivitiesRecordInfo.Rows[i]["SignupTime"].ToString().Trim();
                            ActivitiesRecordInfo.SignupTeamName = DataTableActivitiesRecordInfo.Rows[i]["SignupTeamName"].ToString().Trim();
                            ActivitiesRecordInfo.Deadline = DataTableActivitiesRecordInfo.Rows[i]["Deadline"].ToString().Trim();
                            ListActivitiesRecordInfo.Add(ActivitiesRecordInfo);
                        }

                        // 將資料存入 Json 格式
                        strJson = new JObject(
                                       new JProperty("ResultCode", "1"),
                                       new JProperty("Content",
                                           new JArray(
                            // 使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                               from p in ListActivitiesRecordInfo
                                               select new JObject(
                                                          new JProperty("ActivitiesID", p.ActivitiesID),
                                                          new JProperty("ActivitiesName", p.ActivitiesName.ToString().Trim()),
                                                          new JProperty("SignupNo", p.SignupNo),
                                                          new JProperty("SignupModel", p.SignupModel.ToString().Trim()),
                                                          new JProperty("EmployeeNo", p.EmployeeNo.ToString().Trim()),
                                                          new JProperty("SignupName", p.SignupName.ToString().Trim()),
                                                          new JProperty("SignupPlaces", p.SignupPlaces),
                                                          new JProperty("SignupRelationship", p.SignupRelationship.ToString().Trim()),
                                                          new JProperty("CanCancel", p.CanCancel.ToString().Trim()),
                                                          new JProperty("SignupTime", p.SignupTime.ToString().Trim()),
                                                          new JProperty("SignupTeamName", p.SignupTeamName.ToString().Trim()),
                                                          new JProperty("Deadline", p.Deadline.ToString().Trim())
                                               )
                                           )
                                       )
                                  ).ToString();

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 1 - 成功";
                    }
                    else
                    {
                        // 查無活動報名資料
                        strJson = new JObject(
                                      new JProperty("ResultCode", "045909"),
                                      new JProperty("Content", "")
                                  ).ToString();

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 045909 - 查無活動報名資料";
                    }
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                  new JProperty("ResultCode", "999001"),
                                  new JProperty("Content", "")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 999001 - 傳入參數不足或傳入參數格式錯誤";
                }
            }
            catch (Exception ex)
            {
                strJson = ex.Message.ToString();

                // 20180321 Hakkinen Add ResultCode
                strResultCode = "ResultCode : Exception - " + ex.Message.ToString();
            }

            // 20180321 Hakkinen Insert System Log Begin -----------------------------------------------
            SqlCommand cmdForSystemLog = new SqlCommand("usp_Activities_SystemLog", SQLConn);
            cmdForSystemLog.CommandType = CommandType.StoredProcedure;

            // Parameter Add
            cmdForSystemLog.Parameters.Add("@Log_AppName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_AppName"].Value = "Activitie";
            cmdForSystemLog.Parameters.Add("@Log_FunctionName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_FunctionName"].Value = "Activities_Record";
            cmdForSystemLog.Parameters.Add("@Log_Desc", SqlDbType.NVarChar, 3000);
            cmdForSystemLog.Parameters["@Log_Desc"].Value = strResultCode;
            cmdForSystemLog.ExecuteNonQuery();

            SQLConn.Close();
            // 20180321 Hakkinen Insert System Log End -------------------------------------------------

            // 關閉連結 SQLConn
            SQLConn.Close();


            return strJson;
        }

        // 查詢人員資料
        [WebMethod]
        public string Activities_Signup_Employee(string strXml)
        {
            // 20180321 Hakkinen 開始就先設定
            SqlConnection SQLConn = new SqlConnection(strConnString);

            // 開啟 SQLConn
            SQLConn.Open();

            try
            {
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                    <LayoutHeader><Employee>Hakkinen</Employee></LayoutHeader>
                    <LayoutHeader><Employee>1501005</Employee></LayoutHeader>
				*/
                #endregion

                // 設定傳入參數
                string Employee = xmlDoc.SelectSingleNode("//Employee").InnerText; // 員工工號或英文姓名

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(Employee))
                {
                    // 回傳參數陣列宣告
                    List<EmployeeInfo> ListEmployeeInfo = new List<EmployeeInfo>();

                    // Begin 以下為 SQL 執行程式碼

                    // 設定執行參數
                    DataTable DataTableEmployeeInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand("usp_Activities_Signup_Employee", SQLConn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameter 設定
                    cmd.Parameters.Add("@Employee", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@Employee"].Value = Employee;
                    cmd.ExecuteNonQuery();

                    // 設定 Table 取值
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTableEmployeeInfo);
                    // End 將執行後的資料存到 DataTableEmployeeInfo

                    // 判斷Table是否有值
                    if (DataTableEmployeeInfo != null && DataTableEmployeeInfo.Rows.Count > 0)
                    {
                        for (int i = 0; i < DataTableEmployeeInfo.Rows.Count; i++)
                        {
                            EmployeeInfo EmployeeInfo = new EmployeeInfo();
                            EmployeeInfo.EmployeeDept = DataTableEmployeeInfo.Rows[i]["EmployeeDept"].ToString().Trim();
                            EmployeeInfo.EmployeeName = DataTableEmployeeInfo.Rows[i]["EmployeeName"].ToString().Trim();
                            EmployeeInfo.EmployeeNo = DataTableEmployeeInfo.Rows[i]["EmployeeNo"].ToString().Trim();
                            ListEmployeeInfo.Add(EmployeeInfo);
                        }

                        // 將資料存入 Json 格式
                        strJson = new JObject(
                                      new JProperty("ResultCode", "1"),
                                      new JProperty("Content",
                                          new JArray(
                            //使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                              from p in ListEmployeeInfo
                                              select new JObject(
                                                         new JProperty("EmployeeDept", p.EmployeeDept),
                                                         new JProperty("EmployeeName", p.EmployeeName.ToString().Trim()),
                                                         new JProperty("EmployeeNo", p.EmployeeNo.ToString().Trim())
                                              )
                                          )
                                      )
                                  ).ToString();

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 1 - 成功";
                    }
                    else
                    {
                        // 查無員工資料
                        strJson = new JObject(
                                      new JProperty("ResultCode", "045915"),
                                      new JProperty("Content", "")
                                  ).ToString();

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 045915 - 查無員工資料";
                    }
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                  new JProperty("ResultCode", "999001"),
                                  new JProperty("Content", "")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 999001 - 傳入參數不足或傳入參數格式錯誤";
                }
            }
            catch (Exception ex)
            {
                strJson = ex.Message.ToString();

                // 20180321 Hakkinen Add ResultCode
                strResultCode = "ResultCode : Exception - " + ex.Message.ToString();
            }

            // 20180321 Hakkinen Insert System Log Begin -----------------------------------------------
            SqlCommand cmdForSystemLog = new SqlCommand("usp_Activities_SystemLog", SQLConn);
            cmdForSystemLog.CommandType = CommandType.StoredProcedure;

            // Parameter Add
            cmdForSystemLog.Parameters.Add("@Log_AppName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_AppName"].Value = "Activitie";
            cmdForSystemLog.Parameters.Add("@Log_FunctionName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_FunctionName"].Value = "Activities_Signup_Employee";
            cmdForSystemLog.Parameters.Add("@Log_Desc", SqlDbType.NVarChar, 3000);
            cmdForSystemLog.Parameters["@Log_Desc"].Value = strResultCode;
            cmdForSystemLog.ExecuteNonQuery();
            // 20180321 Hakkinen Insert System Log End -------------------------------------------------

            // 關閉連結 SQLConn
            SQLConn.Close();

            return strJson;
        }

        // 報名頁面 ( 報名相關訊息 )
        [WebMethod]
        public string Activities_Signup(string strXml)
        {
            // 20180321 Hakkinen 開始就先設定
            SqlConnection SQLConn = new SqlConnection(strConnString);

            // 開啟 SQLConn
            SQLConn.Open();

            try
            {
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                    <LayoutHeader>
                        <ActivitiesID>9453</ActivitiesID>
                        <SignupModel>1</SignupModel>
                        <EmployeeNo>1501005</EmployeeNo>
                    </LayoutHeader>
				*/
                #endregion

                // 設定傳入參數
                string ActivitiesID = xmlDoc.SelectSingleNode("//ActivitiesID").InnerText; // 活動編碼
                string SignupModel = xmlDoc.SelectSingleNode("//SignupModel").InnerText; // 報名方式
                string EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText; // 員工工號

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(ActivitiesID) && !string.IsNullOrEmpty(EmployeeNo) && !string.IsNullOrEmpty(SignupModel))
                {
                    // 回傳參數陣列宣告
                    List<ActivitiesSignupInfo> ListActivitiesSignupInfo = new List<ActivitiesSignupInfo>();

                    // Begin 以下為 SQL 執行程式碼

                    // 設定執行參數
                    DataTable DataTableActivitiesSignupInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand("usp_Activities_Signup", SQLConn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameter 設定
                    cmd.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                    cmd.Parameters["@ActivitiesID"].Value = ActivitiesID;
                    cmd.Parameters.Add("@SignupModel", SqlDbType.Int);
                    cmd.Parameters["@SignupModel"].Value = SignupModel;
                    cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@EmployeeNo"].Value = EmployeeNo;

                    cmd.ExecuteNonQuery();

                    // 設定Table取值
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTableActivitiesSignupInfo);
                    // End 將執行後的資料存到 DataTableActivitiesSignupInfo

                    // 判斷 Table 是否有值
                    if ((DataTableActivitiesSignupInfo != null && DataTableActivitiesSignupInfo.Rows.Count > 0) && DataTableActivitiesSignupInfo.Rows[0]["IsRepeatSignup"].ToString().Trim() != "Y")
                    {
                        switch (SignupModel)
                        {
                            case "1":
                                ActivitiesSignupInfo ActivitiesSignupInfo4Personal = new ActivitiesSignupInfo();
                                ActivitiesSignupInfo4Personal.ActivitiesID = (int)DataTableActivitiesSignupInfo.Rows[0]["ActivitiesID"];
                                ActivitiesSignupInfo4Personal.ActivitiesName = DataTableActivitiesSignupInfo.Rows[0]["ActivitiesName"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ActivitiesImage = DataTableActivitiesSignupInfo.Rows[0]["ActivitiesImage"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.LimitPlaces = (int)DataTableActivitiesSignupInfo.Rows[0]["LimitPlaces"];
                                ActivitiesSignupInfo4Personal.ColumnName_1 = DataTableActivitiesSignupInfo.Rows[0]["ColumnName_1"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnType_1 = DataTableActivitiesSignupInfo.Rows[0]["ColumnType_1"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnItem_1 = DataTableActivitiesSignupInfo.Rows[0]["ColumnItem_1"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnName_2 = DataTableActivitiesSignupInfo.Rows[0]["ColumnName_2"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnType_2 = DataTableActivitiesSignupInfo.Rows[0]["ColumnType_2"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnItem_2 = DataTableActivitiesSignupInfo.Rows[0]["ColumnItem_2"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnName_3 = DataTableActivitiesSignupInfo.Rows[0]["ColumnName_3"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnType_3 = DataTableActivitiesSignupInfo.Rows[0]["ColumnType_3"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnItem_3 = DataTableActivitiesSignupInfo.Rows[0]["ColumnItem_3"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnName_4 = DataTableActivitiesSignupInfo.Rows[0]["ColumnName_4"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnType_4 = DataTableActivitiesSignupInfo.Rows[0]["ColumnType_4"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnItem_4 = DataTableActivitiesSignupInfo.Rows[0]["ColumnItem_4"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnName_5 = DataTableActivitiesSignupInfo.Rows[0]["ColumnName_5"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnType_5 = DataTableActivitiesSignupInfo.Rows[0]["ColumnType_5"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ColumnItem_5 = DataTableActivitiesSignupInfo.Rows[0]["ColumnItem_5"].ToString().Trim();
                                ActivitiesSignupInfo4Personal.ActivitiesRemarks = DataTableActivitiesSignupInfo.Rows[0]["ActivitiesRemarks"].ToString().Trim();
                                ListActivitiesSignupInfo.Add(ActivitiesSignupInfo4Personal);

                                // 將資料存入 Json 格式
                                strJson = new JObject(
                                               new JProperty("ResultCode", "1"),
                                               new JProperty("Content",
                                                   new JArray(
                                    // 使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                                       from p in ListActivitiesSignupInfo
                                                       select new JObject(
                                                                  new JProperty("ActivitiesID", p.ActivitiesID),
                                                                  new JProperty("ActivitiesName", p.ActivitiesName.ToString().Trim()),
                                                                  new JProperty("ActivitiesImage", p.ActivitiesImage.ToString().Trim()),
                                                                  new JProperty("LimitPlaces", p.LimitPlaces),
                                                                  new JProperty("ColumnName_1", p.ColumnName_1.ToString().Trim()),
                                                                  new JProperty("ColumnType_1", p.ColumnType_1.ToString().Trim()),
                                                                  new JProperty("ColumnItem_1", p.ColumnItem_1.ToString().Trim()),
                                                                  new JProperty("ColumnName_2", p.ColumnName_2.ToString().Trim()),
                                                                  new JProperty("ColumnType_2", p.ColumnType_2.ToString().Trim()),
                                                                  new JProperty("ColumnItem_2", p.ColumnItem_2.ToString().Trim()),
                                                                  new JProperty("ColumnName_3", p.ColumnName_3.ToString().Trim()),
                                                                  new JProperty("ColumnType_3", p.ColumnType_3.ToString().Trim()),
                                                                  new JProperty("ColumnItem_3", p.ColumnItem_3.ToString().Trim()),
                                                                  new JProperty("ColumnName_4", p.ColumnName_4.ToString().Trim()),
                                                                  new JProperty("ColumnType_4", p.ColumnType_4.ToString().Trim()),
                                                                  new JProperty("ColumnItem_4", p.ColumnItem_4.ToString().Trim()),
                                                                  new JProperty("ColumnName_5", p.ColumnName_5.ToString().Trim()),
                                                                  new JProperty("ColumnType_5", p.ColumnType_5.ToString().Trim()),
                                                                  new JProperty("ColumnItem_5", p.ColumnItem_5.ToString().Trim()),
                                                                  new JProperty("ActivitiesRemarks", p.ActivitiesRemarks.ToString().Trim())
                                                       )
                                                   )
                                               )
                                          ).ToString();
                                break;
                            case "3":
                                ActivitiesSignupInfo ActivitiesSignupInfo4Family = new ActivitiesSignupInfo();
                                ActivitiesSignupInfo4Family.ActivitiesID = (int)DataTableActivitiesSignupInfo.Rows[0]["ActivitiesID"];
                                ActivitiesSignupInfo4Family.ActivitiesName = DataTableActivitiesSignupInfo.Rows[0]["ActivitiesName"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ActivitiesImage = DataTableActivitiesSignupInfo.Rows[0]["ActivitiesImage"].ToString().Trim();
                                ActivitiesSignupInfo4Family.LimitPlaces = (int)DataTableActivitiesSignupInfo.Rows[0]["LimitPlaces"];
                                ActivitiesSignupInfo4Family.SignupPlaces = (int)DataTableActivitiesSignupInfo.Rows[0]["SignupPlaces"];
                                ActivitiesSignupInfo4Family.EmployeeName = DataTableActivitiesSignupInfo.Rows[0]["EmployeeName"].ToString().Trim();
                                ActivitiesSignupInfo4Family.EmpoyeeID = DataTableActivitiesSignupInfo.Rows[0]["EmpoyeeID"].ToString().Trim();
                                ActivitiesSignupInfo4Family.EmployeeBirthday = DataTableActivitiesSignupInfo.Rows[0]["EmployeeBirthday"].ToString().Trim();
                                ActivitiesSignupInfo4Family.EmployeeGender = DataTableActivitiesSignupInfo.Rows[0]["EmployeeGender"].ToString().Trim();
                                ActivitiesSignupInfo4Family.EmployeeRelationship = DataTableActivitiesSignupInfo.Rows[0]["EmployeeRelationship"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnName_1 = DataTableActivitiesSignupInfo.Rows[0]["ColumnName_1"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnType_1 = DataTableActivitiesSignupInfo.Rows[0]["ColumnType_1"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnItem_1 = DataTableActivitiesSignupInfo.Rows[0]["ColumnItem_1"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnName_2 = DataTableActivitiesSignupInfo.Rows[0]["ColumnName_2"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnType_2 = DataTableActivitiesSignupInfo.Rows[0]["ColumnType_2"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnItem_2 = DataTableActivitiesSignupInfo.Rows[0]["ColumnItem_2"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnName_3 = DataTableActivitiesSignupInfo.Rows[0]["ColumnName_3"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnType_3 = DataTableActivitiesSignupInfo.Rows[0]["ColumnType_3"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnItem_3 = DataTableActivitiesSignupInfo.Rows[0]["ColumnItem_3"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnName_4 = DataTableActivitiesSignupInfo.Rows[0]["ColumnName_4"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnType_4 = DataTableActivitiesSignupInfo.Rows[0]["ColumnType_4"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnItem_4 = DataTableActivitiesSignupInfo.Rows[0]["ColumnItem_4"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnName_5 = DataTableActivitiesSignupInfo.Rows[0]["ColumnName_5"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnType_5 = DataTableActivitiesSignupInfo.Rows[0]["ColumnType_5"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ColumnItem_5 = DataTableActivitiesSignupInfo.Rows[0]["ColumnItem_5"].ToString().Trim();
                                ActivitiesSignupInfo4Family.ActivitiesRemarks = DataTableActivitiesSignupInfo.Rows[0]["ActivitiesRemarks"].ToString().Trim();
                                ListActivitiesSignupInfo.Add(ActivitiesSignupInfo4Family);

                                // 將資料存入 Json 格式
                                strJson = new JObject(
                                               new JProperty("ResultCode", "1"),
                                               new JProperty("Content",
                                                   new JArray(
                                    // 使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                                       from p in ListActivitiesSignupInfo
                                                       select new JObject(
                                                                  new JProperty("ActivitiesID", p.ActivitiesID),
                                                                  new JProperty("ActivitiesName", p.ActivitiesName.ToString().Trim()),
                                                                  new JProperty("ActivitiesImage", p.ActivitiesImage.ToString().Trim()),
                                                                  new JProperty("LimitPlaces", p.LimitPlaces),
                                                                  new JProperty("SignupPlaces", p.SignupPlaces),
                                                                  new JProperty("EmployeeName", p.EmployeeName.ToString().Trim()),
                                                                  new JProperty("EmpoyeeID", p.EmpoyeeID.ToString().Trim()),
                                                                  new JProperty("EmployeeBirthday", p.EmployeeBirthday.ToString().Trim()),
                                                                  new JProperty("EmployeeGender", p.EmployeeGender.ToString().Trim()),
                                                                  new JProperty("EmployeeRelationship", p.EmployeeRelationship.ToString().Trim()),
                                                                  new JProperty("ColumnName_1", p.ColumnName_1.ToString().Trim()),
                                                                  new JProperty("ColumnType_1", p.ColumnType_1.ToString().Trim()),
                                                                  new JProperty("ColumnItem_1", p.ColumnItem_1.ToString().Trim()),
                                                                  new JProperty("ColumnName_2", p.ColumnName_2.ToString().Trim()),
                                                                  new JProperty("ColumnType_2", p.ColumnType_2.ToString().Trim()),
                                                                  new JProperty("ColumnItem_2", p.ColumnItem_2.ToString().Trim()),
                                                                  new JProperty("ColumnName_3", p.ColumnName_3.ToString().Trim()),
                                                                  new JProperty("ColumnType_3", p.ColumnType_3.ToString().Trim()),
                                                                  new JProperty("ColumnItem_3", p.ColumnItem_3.ToString().Trim()),
                                                                  new JProperty("ColumnName_4", p.ColumnName_4.ToString().Trim()),
                                                                  new JProperty("ColumnType_4", p.ColumnType_4.ToString().Trim()),
                                                                  new JProperty("ColumnItem_4", p.ColumnItem_4.ToString().Trim()),
                                                                  new JProperty("ColumnName_5", p.ColumnName_5.ToString().Trim()),
                                                                  new JProperty("ColumnType_5", p.ColumnType_5.ToString().Trim()),
                                                                  new JProperty("ColumnItem_5", p.ColumnItem_5.ToString().Trim()),
                                                                  new JProperty("ActivitiesRemarks", p.ActivitiesRemarks.ToString().Trim())
                                                       )
                                                   )
                                               )
                                          ).ToString();
                                break;
                            case "4":
                                ActivitiesSignupInfo ActivitiesSignupInfo4Team = new ActivitiesSignupInfo();
                                ActivitiesSignupInfo4Team.ActivitiesID = (int)DataTableActivitiesSignupInfo.Rows[0]["ActivitiesID"];
                                ActivitiesSignupInfo4Team.ActivitiesName = DataTableActivitiesSignupInfo.Rows[0]["ActivitiesName"].ToString().Trim();
                                ActivitiesSignupInfo4Team.ActivitiesImage = DataTableActivitiesSignupInfo.Rows[0]["ActivitiesImage"].ToString().Trim();
                                ActivitiesSignupInfo4Team.LimitPlaces = (int)DataTableActivitiesSignupInfo.Rows[0]["LimitPlaces"];
                                ActivitiesSignupInfo4Team.ActivitiesRemarks = DataTableActivitiesSignupInfo.Rows[0]["ActivitiesRemarks"].ToString().Trim();
                                ListActivitiesSignupInfo.Add(ActivitiesSignupInfo4Team);

                                // 將資料存入 Json 格式
                                strJson = new JObject(
                                               new JProperty("ResultCode", "1"),
                                               new JProperty("Content",
                                                   new JArray(
                                    // 使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                                       from p in ListActivitiesSignupInfo
                                                       select new JObject(
                                                                  new JProperty("ActivitiesID", p.ActivitiesID),
                                                                  new JProperty("ActivitiesName", p.ActivitiesName.ToString().Trim()),
                                                                  new JProperty("ActivitiesImage", p.ActivitiesImage.ToString().Trim()),
                                                                  new JProperty("LimitPlaces", p.LimitPlaces),
                                                                  new JProperty("ActivitiesRemarks", p.ActivitiesRemarks.ToString().Trim())
                                                       )
                                                   )
                                               )
                                          ).ToString();
                                break;
                            case "5":
                                for (int i = 0; i < DataTableActivitiesSignupInfo.Rows.Count; i++)
                                {
                                    ActivitiesSignupInfo ActivitiesSignupInfo4Time = new ActivitiesSignupInfo();
                                    ActivitiesSignupInfo4Time.ActivitiesID = (int)DataTableActivitiesSignupInfo.Rows[i]["ActivitiesID"];
                                    ActivitiesSignupInfo4Time.ActivitiesName = DataTableActivitiesSignupInfo.Rows[i]["ActivitiesName"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ActivitiesImage = DataTableActivitiesSignupInfo.Rows[i]["ActivitiesImage"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnName_1 = DataTableActivitiesSignupInfo.Rows[i]["ColumnName_1"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnType_1 = DataTableActivitiesSignupInfo.Rows[i]["ColumnType_1"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnItem_1 = DataTableActivitiesSignupInfo.Rows[i]["ColumnItem_1"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnName_2 = DataTableActivitiesSignupInfo.Rows[i]["ColumnName_2"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnType_2 = DataTableActivitiesSignupInfo.Rows[i]["ColumnType_2"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnItem_2 = DataTableActivitiesSignupInfo.Rows[i]["ColumnItem_2"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnName_3 = DataTableActivitiesSignupInfo.Rows[i]["ColumnName_3"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnType_3 = DataTableActivitiesSignupInfo.Rows[i]["ColumnType_3"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnItem_3 = DataTableActivitiesSignupInfo.Rows[i]["ColumnItem_3"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnName_4 = DataTableActivitiesSignupInfo.Rows[i]["ColumnName_4"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnType_4 = DataTableActivitiesSignupInfo.Rows[i]["ColumnType_4"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnItem_4 = DataTableActivitiesSignupInfo.Rows[i]["ColumnItem_4"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnName_5 = DataTableActivitiesSignupInfo.Rows[i]["ColumnName_5"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnType_5 = DataTableActivitiesSignupInfo.Rows[i]["ColumnType_5"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.ColumnItem_5 = DataTableActivitiesSignupInfo.Rows[i]["ColumnItem_5"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.TimeID = (int)DataTableActivitiesSignupInfo.Rows[i]["TimeID"];
                                    ActivitiesSignupInfo4Time.TimeSort = (int)DataTableActivitiesSignupInfo.Rows[i]["TimeSort"];
                                    ActivitiesSignupInfo4Time.SignupTime = DataTableActivitiesSignupInfo.Rows[i]["SignupTime"].ToString().Trim();
                                    ActivitiesSignupInfo4Time.QuotaPlaces = (int)DataTableActivitiesSignupInfo.Rows[i]["QuotaPlaces"];
                                    ActivitiesSignupInfo4Time.RemainingPlaces = (int)DataTableActivitiesSignupInfo.Rows[i]["RemainingPlaces"];
                                    ActivitiesSignupInfo4Time.ActivitiesRemarks = DataTableActivitiesSignupInfo.Rows[i]["ActivitiesRemarks"].ToString().Trim();
                                    ListActivitiesSignupInfo.Add(ActivitiesSignupInfo4Time);
                                }
                                // 將資料存入 Json 格式
                                strJson = new JObject(
                                               new JProperty("ResultCode", "1"),
                                               new JProperty("Content",
                                                   new JArray(
                                    // 使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                                       from p in ListActivitiesSignupInfo
                                                       select new JObject(
                                                                   new JProperty("ActivitiesID", p.ActivitiesID),
                                                                   new JProperty("ActivitiesName", p.ActivitiesName.ToString().Trim()),
                                                                   new JProperty("ActivitiesImage", p.ActivitiesImage.ToString().Trim()),
                                                                   new JProperty("ColumnName_1", p.ColumnName_1.ToString().Trim()),
                                                                   new JProperty("ColumnType_1", p.ColumnType_1.ToString().Trim()),
                                                                   new JProperty("ColumnItem_1", p.ColumnItem_1.ToString().Trim()),
                                                                   new JProperty("ColumnName_2", p.ColumnName_2.ToString().Trim()),
                                                                   new JProperty("ColumnType_2", p.ColumnType_2.ToString().Trim()),
                                                                   new JProperty("ColumnItem_2", p.ColumnItem_2.ToString().Trim()),
                                                                   new JProperty("ColumnName_3", p.ColumnName_3.ToString().Trim()),
                                                                   new JProperty("ColumnType_3", p.ColumnType_3.ToString().Trim()),
                                                                   new JProperty("ColumnItem_3", p.ColumnItem_3.ToString().Trim()),
                                                                   new JProperty("ColumnName_4", p.ColumnName_4.ToString().Trim()),
                                                                   new JProperty("ColumnType_4", p.ColumnType_4.ToString().Trim()),
                                                                   new JProperty("ColumnItem_4", p.ColumnItem_4.ToString().Trim()),
                                                                   new JProperty("ColumnName_5", p.ColumnName_5.ToString().Trim()),
                                                                   new JProperty("ColumnType_5", p.ColumnType_5.ToString().Trim()),
                                                                   new JProperty("ColumnItem_5", p.ColumnItem_5.ToString().Trim()),
                                                                   new JProperty("TimeID", p.TimeID),
                                                                   new JProperty("TimeSort", p.TimeSort),
                                                                   new JProperty("SignupTime", p.SignupTime.ToString().Trim()),
                                                                   new JProperty("QuotaPlaces", p.QuotaPlaces),
                                                                   new JProperty("RemainingPlaces", p.RemainingPlaces),
                                                                   new JProperty("ActivitiesRemarks", p.ActivitiesRemarks.ToString().Trim())
                                                      )
                                                   )
                                               )
                                          ).ToString();
                                break;
                        }

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 1 - 成功";
                    }
                    else
                    {
                        // 您已經報名其他場次
                        strJson = new JObject(
                                      new JProperty("ResultCode", "045910"),
                                      new JProperty("Content", "")
                                  ).ToString();

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 045910 - 您已經報名其他場次";
                    }
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                  new JProperty("ResultCode", "999001"),
                                  new JProperty("Content", "")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 999001 - 傳入參數不足或傳入參數格式錯誤";
                }
            }
            catch (Exception ex)
            {
                strJson = ex.Message.ToString();

                // 20180321 Hakkinen Add ResultCode
                strResultCode = "ResultCode : Exception - " + ex.Message.ToString();
            }

            // 20180321 Hakkinen Insert System Log Begin -----------------------------------------------
            SqlCommand cmdForSystemLog = new SqlCommand("usp_Activities_SystemLog", SQLConn);
            cmdForSystemLog.CommandType = CommandType.StoredProcedure;

            // Parameter Add
            cmdForSystemLog.Parameters.Add("@Log_AppName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_AppName"].Value = "Activitie";
            cmdForSystemLog.Parameters.Add("@Log_FunctionName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_FunctionName"].Value = "Activities_Signup";
            cmdForSystemLog.Parameters.Add("@Log_Desc", SqlDbType.NVarChar, 3000);
            cmdForSystemLog.Parameters["@Log_Desc"].Value = strResultCode;
            cmdForSystemLog.ExecuteNonQuery();
            // 20180321 Hakkinen Insert System Log End -------------------------------------------------

            // 關閉連結 SQLConn
             SQLConn.Close();

            return strJson;
        }

        // 報名管理頁面 ( 報名相關訊息 )
        [WebMethod]
        public string Activities_Signup_Manage(string strXml)
        {
            // 20180321 Hakkinen 開始就先設定
            SqlConnection SQLConn = new SqlConnection(strConnString);

            // 開啟 SQLConn
            SQLConn.Open();

            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                    <LayoutHeader>
                        <ActivitiesID>9453</ActivitiesID>
                        <SignupModel>1</SignupModel>
                        <EmployeeNo>1501005</EmployeeNo>
                    </LayoutHeader>
				*/
                #endregion

                // 設定傳入參數
                string ActivitiesID = xmlDoc.SelectSingleNode("//ActivitiesID").InnerText; // 活動編碼
                string SignupModel = xmlDoc.SelectSingleNode("//SignupModel").InnerText; // 報名方式
                string EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText; // 員工工號

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(ActivitiesID) && !string.IsNullOrEmpty(EmployeeNo) && !string.IsNullOrEmpty(SignupModel))
                {
                    // 回傳參數陣列宣告
                    List<ActivitiesSignupManageInfo> ListActivitiesSignupManageInfo = new List<ActivitiesSignupManageInfo>();

                    // Begin 以下為 SQL 執行程式碼

                    // 設定執行參數
                    DataTable DataTableActivitiesSignupManageInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand("usp_Activities_Signup_Manage", SQLConn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameter 設定
                    cmd.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                    cmd.Parameters["@ActivitiesID"].Value = ActivitiesID;
                    cmd.Parameters.Add("@SignupModel", SqlDbType.Int);
                    cmd.Parameters["@SignupModel"].Value = SignupModel;
                    cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@EmployeeNo"].Value = EmployeeNo;

                    cmd.ExecuteNonQuery();

                    // 設定Table取值
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTableActivitiesSignupManageInfo);
                    // End 將執行後的資料存到 DataTableActivitiesSignupManageInfo

                    // 判斷Table是否有值
                    if (DataTableActivitiesSignupManageInfo != null && DataTableActivitiesSignupManageInfo.Rows.Count > 0)
                    {
                        switch (SignupModel)
                        {
                            case "1":
                                ActivitiesSignupManageInfo ActivitiesSignupManagelInfo4Personal = new ActivitiesSignupManageInfo();
                                ActivitiesSignupManagelInfo4Personal.ActivitiesID = (int)DataTableActivitiesSignupManageInfo.Rows[0]["ActivitiesID"];
                                ActivitiesSignupManagelInfo4Personal.ActivitiesName = DataTableActivitiesSignupManageInfo.Rows[0]["ActivitiesName"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ActivitiesImage = DataTableActivitiesSignupManageInfo.Rows[0]["ActivitiesImage"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.LimitPlaces = (int)DataTableActivitiesSignupManageInfo.Rows[0]["LimitPlaces"];
                                ActivitiesSignupManagelInfo4Personal.SignupPlaces = (int)DataTableActivitiesSignupManageInfo.Rows[0]["SignupPlaces"];
                                ActivitiesSignupManagelInfo4Personal.IsFull = DataTableActivitiesSignupManageInfo.Rows[0]["IsFull"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnName_1 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnName_1"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnType_1 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnType_1"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnItem_1 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnItem_1"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnAnswer_1 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnAnswer_1"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnName_2 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnName_2"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnType_2 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnType_2"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnItem_2 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnItem_2"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnAnswer_2 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnAnswer_2"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnName_3 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnName_3"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnType_3 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnType_3"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnItem_3 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnItem_3"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnAnswer_3 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnAnswer_3"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnName_4 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnName_4"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnType_4 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnType_4"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnItem_4 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnItem_4"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnAnswer_4 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnAnswer_4"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnName_5 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnName_5"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnType_5 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnType_5"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnItem_5 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnItem_5"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ColumnAnswer_5 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnAnswer_5"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.ActivitiesRemarks = DataTableActivitiesSignupManageInfo.Rows[0]["ActivitiesRemarks"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.EmployeeName = DataTableActivitiesSignupManageInfo.Rows[0]["EmployeeName"].ToString().Trim();
                                ActivitiesSignupManagelInfo4Personal.SignupNo = DataTableActivitiesSignupManageInfo.Rows[0]["SignupNo"].ToString().Trim();
                                ListActivitiesSignupManageInfo.Add(ActivitiesSignupManagelInfo4Personal);

                                // 將資料存入 Json 格式
                                strJson = new JObject(
                                               new JProperty("ResultCode", "1"),
                                               new JProperty("Content",
                                                   new JArray(
                                    // 使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                                       from p in ListActivitiesSignupManageInfo
                                                       select new JObject(
                                                                  new JProperty("ActivitiesID", p.ActivitiesID),
                                                                  new JProperty("ActivitiesName", p.ActivitiesName.ToString().Trim()),
                                                                  new JProperty("ActivitiesImage", p.ActivitiesImage.ToString().Trim()),
                                                                  new JProperty("LimitPlaces", p.LimitPlaces),
                                                                  new JProperty("SignupPlaces", p.SignupPlaces),
                                                                  new JProperty("IsFull", p.IsFull),
                                                                  new JProperty("ColumnName_1", p.ColumnName_1.ToString().Trim()),
                                                                  new JProperty("ColumnType_1", p.ColumnType_1.ToString().Trim()),
                                                                  new JProperty("ColumnItem_1", p.ColumnItem_1.ToString().Trim()),
                                                                  new JProperty("ColumnAnswer_1", p.ColumnAnswer_1.ToString().Trim()),
                                                                  new JProperty("ColumnName_2", p.ColumnName_2.ToString().Trim()),
                                                                  new JProperty("ColumnType_2", p.ColumnType_2.ToString().Trim()),
                                                                  new JProperty("ColumnItem_2", p.ColumnItem_2.ToString().Trim()),
                                                                  new JProperty("ColumnAnswer_2", p.ColumnAnswer_2.ToString().Trim()),
                                                                  new JProperty("ColumnName_3", p.ColumnName_3.ToString().Trim()),
                                                                  new JProperty("ColumnType_3", p.ColumnType_3.ToString().Trim()),
                                                                  new JProperty("ColumnItem_3", p.ColumnItem_3.ToString().Trim()),
                                                                  new JProperty("ColumnAnswer_3", p.ColumnAnswer_3.ToString().Trim()),
                                                                  new JProperty("ColumnName_4", p.ColumnName_4.ToString().Trim()),
                                                                  new JProperty("ColumnType_4", p.ColumnType_4.ToString().Trim()),
                                                                  new JProperty("ColumnItem_4", p.ColumnItem_4.ToString().Trim()),
                                                                  new JProperty("ColumnAnswer_4", p.ColumnAnswer_4.ToString().Trim()),
                                                                  new JProperty("ColumnName_5", p.ColumnName_5.ToString().Trim()),
                                                                  new JProperty("ColumnType_5", p.ColumnType_5.ToString().Trim()),
                                                                  new JProperty("ColumnItem_5", p.ColumnItem_5.ToString().Trim()),
                                                                  new JProperty("ColumnAnswer_5", p.ColumnAnswer_5.ToString().Trim()),
                                                                  new JProperty("ActivitiesRemarks", p.ActivitiesRemarks.ToString().Trim()),
                                                                  new JProperty("EmployeeName", p.EmployeeName.ToString().Trim()),
                                                                  new JProperty("SignupNo", p.SignupNo.ToString().Trim())
                                                       )
                                                   )
                                               )
                                          ).ToString();
                                break;
                            case "3":
                                ActivitiesSignupManageInfo ActivitiesSignuplInfo4Family = new ActivitiesSignupManageInfo();
                                ActivitiesSignuplInfo4Family.ActivitiesID = (int)DataTableActivitiesSignupManageInfo.Rows[0]["ActivitiesID"];
                                ActivitiesSignuplInfo4Family.ActivitiesName = DataTableActivitiesSignupManageInfo.Rows[0]["ActivitiesName"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ActivitiesImage = DataTableActivitiesSignupManageInfo.Rows[0]["ActivitiesImage"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.LimitPlaces = (int)DataTableActivitiesSignupManageInfo.Rows[0]["LimitPlaces"];
                                ActivitiesSignuplInfo4Family.SignupPlaces = (int)DataTableActivitiesSignupManageInfo.Rows[0]["SignupPlaces"];
                                ActivitiesSignuplInfo4Family.IsFull = DataTableActivitiesSignupManageInfo.Rows[0]["IsFull"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.EmployeeName = DataTableActivitiesSignupManageInfo.Rows[0]["EmployeeName"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.EmpoyeeID = DataTableActivitiesSignupManageInfo.Rows[0]["EmpoyeeID"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.EmployeeBirthday = DataTableActivitiesSignupManageInfo.Rows[0]["EmployeeBirthday"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.EmployeeGender = DataTableActivitiesSignupManageInfo.Rows[0]["EmployeeGender"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.EmployeeRelationship = DataTableActivitiesSignupManageInfo.Rows[0]["EmployeeRelationship"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnName_1 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnName_1"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnType_1 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnType_1"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnItem_1 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnItem_1"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnAnswer_1 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnAnswer_1"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnName_2 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnName_2"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnType_2 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnType_2"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnItem_2 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnItem_2"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnAnswer_2 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnAnswer_2"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnName_3 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnName_3"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnType_3 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnType_3"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnItem_3 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnItem_3"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnAnswer_3 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnAnswer_3"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnName_4 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnName_4"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnType_4 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnType_4"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnItem_4 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnItem_4"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnAnswer_4 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnAnswer_4"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnName_5 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnName_5"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnType_5 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnType_5"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnItem_5 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnItem_5"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ColumnAnswer_5 = DataTableActivitiesSignupManageInfo.Rows[0]["ColumnAnswer_5"].ToString().Trim();
                                ActivitiesSignuplInfo4Family.ActivitiesRemarks = DataTableActivitiesSignupManageInfo.Rows[0]["ActivitiesRemarks"].ToString().Trim();
                                ListActivitiesSignupManageInfo.Add(ActivitiesSignuplInfo4Family);

                                // 將資料存入 Json 格式
                                strJson = new JObject(
                                              new JProperty("ResultCode", "1"),
                                              new JProperty("Content",
                                                  new JArray(
                                    // 使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                                      from p in ListActivitiesSignupManageInfo
                                                      select new JObject(
                                                                 new JProperty("ActivitiesID", p.ActivitiesID),
                                                                 new JProperty("ActivitiesName", p.ActivitiesName.ToString().Trim()),
                                                                 new JProperty("ActivitiesImage", p.ActivitiesImage.ToString().Trim()),
                                                                 new JProperty("LimitPlaces", p.LimitPlaces),
                                                                 new JProperty("SignupPlaces", p.SignupPlaces),
                                                                 new JProperty("IsFull", p.IsFull.ToString().Trim()),
                                                                 new JProperty("EmployeeName", p.EmployeeName.ToString().Trim()),
                                                                 new JProperty("EmpoyeeID", p.EmpoyeeID.ToString().Trim()),
                                                                 new JProperty("EmployeeBirthday", p.EmployeeBirthday.ToString().Trim()),
                                                                 new JProperty("EmployeeGender", p.EmployeeGender.ToString().Trim()),
                                                                 new JProperty("EmployeeRelationship", p.EmployeeRelationship.ToString().Trim()),
                                                                 new JProperty("ColumnName_1", p.ColumnName_1.ToString().Trim()),
                                                                 new JProperty("ColumnType_1", p.ColumnType_1.ToString().Trim()),
                                                                 new JProperty("ColumnItem_1", p.ColumnItem_1.ToString().Trim()),
                                                                 new JProperty("ColumnAnswer_1", p.ColumnAnswer_1.ToString().Trim()),
                                                                 new JProperty("ColumnName_2", p.ColumnName_2.ToString().Trim()),
                                                                 new JProperty("ColumnType_2", p.ColumnType_2.ToString().Trim()),
                                                                 new JProperty("ColumnItem_2", p.ColumnItem_2.ToString().Trim()),
                                                                 new JProperty("ColumnAnswer_2", p.ColumnAnswer_2.ToString().Trim()),
                                                                 new JProperty("ColumnName_3", p.ColumnName_3.ToString().Trim()),
                                                                 new JProperty("ColumnType_3", p.ColumnType_3.ToString().Trim()),
                                                                 new JProperty("ColumnItem_3", p.ColumnItem_3.ToString().Trim()),
                                                                 new JProperty("ColumnAnswer_3", p.ColumnAnswer_3.ToString().Trim()),
                                                                 new JProperty("ColumnName_4", p.ColumnName_4.ToString().Trim()),
                                                                 new JProperty("ColumnType_4", p.ColumnType_4.ToString().Trim()),
                                                                 new JProperty("ColumnItem_4", p.ColumnItem_4.ToString().Trim()),
                                                                 new JProperty("ColumnAnswer_4", p.ColumnAnswer_4.ToString().Trim()),
                                                                 new JProperty("ColumnName_5", p.ColumnName_5.ToString().Trim()),
                                                                 new JProperty("ColumnType_5", p.ColumnType_5.ToString().Trim()),
                                                                 new JProperty("ColumnItem_5", p.ColumnItem_5.ToString().Trim()),
                                                                 new JProperty("ColumnAnswer_5", p.ColumnAnswer_5.ToString().Trim()),
                                                                 new JProperty("ActivitiesRemarks", p.ActivitiesRemarks.ToString().Trim())
                                                      )
                                                  )
                                              )
                                          ).ToString();
                                break;
                            case "4":
                                int TeamNo = 0;
                                string TeamID = string.Empty;
                                for (int i = 0; i < DataTableActivitiesSignupManageInfo.Rows.Count; i++)
                                {
                                    ActivitiesSignupManageInfo ActivitiesSignupManageInfo4Team = new ActivitiesSignupManageInfo();
                                    ActivitiesSignupManageInfo4Team.ActivitiesID = (int)DataTableActivitiesSignupManageInfo.Rows[i]["ActivitiesID"];
                                    ActivitiesSignupManageInfo4Team.ActivitiesName = DataTableActivitiesSignupManageInfo.Rows[i]["ActivitiesName"].ToString().Trim();
                                    ActivitiesSignupManageInfo4Team.ActivitiesImage = DataTableActivitiesSignupManageInfo.Rows[i]["ActivitiesImage"].ToString().Trim();
                                    ActivitiesSignupManageInfo4Team.ActivitiesRemarks = DataTableActivitiesSignupManageInfo.Rows[i]["ActivitiesRemarks"].ToString().Trim();
                                    ActivitiesSignupManageInfo4Team.SignupTeam = (int)DataTableActivitiesSignupManageInfo.Rows[i]["SignupTeam"];
                                    if (i == 0)
                                    {
                                        TeamNo = TeamNo + 1;
                                        TeamID = DataTableActivitiesSignupManageInfo.Rows[i]["TeamID"].ToString().Trim();
                                        ActivitiesSignupManageInfo4Team.TeamNo = TeamNo;
                                    }
                                    else if (TeamID != DataTableActivitiesSignupManageInfo.Rows[i]["TeamID"].ToString().Trim())
                                    {
                                        TeamNo = TeamNo + 1;
                                        TeamID = DataTableActivitiesSignupManageInfo.Rows[i]["TeamID"].ToString().Trim();
                                        ActivitiesSignupManageInfo4Team.TeamNo = TeamNo;
                                    }
                                    else
                                    {
                                        TeamID = DataTableActivitiesSignupManageInfo.Rows[i]["TeamID"].ToString().Trim();
                                        ActivitiesSignupManageInfo4Team.TeamNo = TeamNo;
                                    }
                                    ActivitiesSignupManageInfo4Team.TeamID = DataTableActivitiesSignupManageInfo.Rows[i]["TeamID"].ToString().Trim();
                                    ActivitiesSignupManageInfo4Team.TeamName = DataTableActivitiesSignupManageInfo.Rows[i]["TeamName"].ToString().Trim();
                                    ActivitiesSignupManageInfo4Team.TeamDept = DataTableActivitiesSignupManageInfo.Rows[i]["TeamDept"].ToString().Trim();
                                    ActivitiesSignupManageInfo4Team.TeamMember = DataTableActivitiesSignupManageInfo.Rows[i]["TeamMember"].ToString().Trim();
                                    ActivitiesSignupManageInfo4Team.TeamMemberDept = DataTableActivitiesSignupManageInfo.Rows[i]["TeamMemberDept"].ToString().Trim();
                                    ListActivitiesSignupManageInfo.Add(ActivitiesSignupManageInfo4Team);
                                }
                                // 將資料存入 Json 格式
                                strJson = new JObject(
                                               new JProperty("ResultCode", "1"),
                                               new JProperty("Content",
                                                   new JArray(
                                    // 使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                                       from p in ListActivitiesSignupManageInfo
                                                       select new JObject(
                                                                  new JProperty("ActivitiesID", p.ActivitiesID),
                                                                  new JProperty("ActivitiesName", p.ActivitiesName.ToString().Trim()),
                                                                  new JProperty("ActivitiesImage", p.ActivitiesImage.ToString().Trim()),
                                                                  new JProperty("LimitPlaces", p.LimitPlaces),
                                                                  new JProperty("SignupTeam", p.SignupTeam),
                                                                  new JProperty("TeamNo", p.TeamNo),
                                                                  new JProperty("TeamID", p.TeamID.ToString().Trim()),
                                                                  new JProperty("TeamName", p.TeamName.ToString().Trim()),
                                                                  new JProperty("TeamDept", p.TeamDept.ToString().Trim()),
                                                                  new JProperty("TeamMember", p.TeamMember.ToString().Trim()),
                                                                  new JProperty("TeamMemberDept", p.TeamMemberDept.ToString().Trim()),
                                                                  new JProperty("ActivitiesRemarks", p.ActivitiesRemarks.ToString().Trim())
                                                       )
                                                   )
                                               )
                                          ).ToString();
                                break;
                            case "5":
                                for (int i = 0; i < DataTableActivitiesSignupManageInfo.Rows.Count; i++)
                                {
                                    ActivitiesSignupManageInfo ActivitiesSignupMangeInfo4Time = new ActivitiesSignupManageInfo();
                                    ActivitiesSignupMangeInfo4Time.ActivitiesID = (int)DataTableActivitiesSignupManageInfo.Rows[i]["ActivitiesID"];
                                    ActivitiesSignupMangeInfo4Time.ActivitiesName = DataTableActivitiesSignupManageInfo.Rows[i]["ActivitiesName"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ActivitiesImage = DataTableActivitiesSignupManageInfo.Rows[i]["ActivitiesImage"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.TimeID = (int)DataTableActivitiesSignupManageInfo.Rows[i]["TimeID"];
                                    ActivitiesSignupMangeInfo4Time.TimeSort = (int)DataTableActivitiesSignupManageInfo.Rows[i]["TimeSort"];
                                    ActivitiesSignupMangeInfo4Time.SignupTime = DataTableActivitiesSignupManageInfo.Rows[i]["SignupTime"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.QuotaPlaces = (int)DataTableActivitiesSignupManageInfo.Rows[i]["QuotaPlaces"];
                                    ActivitiesSignupMangeInfo4Time.RemainingPlaces = (int)DataTableActivitiesSignupManageInfo.Rows[i]["RemainingPlaces"];
                                    ActivitiesSignupMangeInfo4Time.ActivitiesRemarks = DataTableActivitiesSignupManageInfo.Rows[i]["ActivitiesRemarks"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.IsSignupTime = DataTableActivitiesSignupManageInfo.Rows[i]["IsSignupTime"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnName_1 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnName_1"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnType_1 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnType_1"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnAnswer_1 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnAnswer_1"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnName_2 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnName_2"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnType_2 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnType_2"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnAnswer_2 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnAnswer_2"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnName_3 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnName_3"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnType_3 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnType_3"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnAnswer_3 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnAnswer_3"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnName_4 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnName_4"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnType_4 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnType_4"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnAnswer_4 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnAnswer_4"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnName_5 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnName_5"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnType_5 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnType_5"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.ColumnAnswer_5 = DataTableActivitiesSignupManageInfo.Rows[i]["ColumnAnswer_5"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.EmployeeName = DataTableActivitiesSignupManageInfo.Rows[i]["EmployeeName"].ToString().Trim();
                                    ActivitiesSignupMangeInfo4Time.SignupNo = DataTableActivitiesSignupManageInfo.Rows[i]["SignupNo"].ToString().Trim();
                                    ListActivitiesSignupManageInfo.Add(ActivitiesSignupMangeInfo4Time);
                                }
                                // 將資料存入 Json 格式
                                strJson = new JObject(
                                              new JProperty("ResultCode", "1"),
                                              new JProperty("Content",
                                                  new JArray(
                                    // 使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                                      from p in ListActivitiesSignupManageInfo
                                                      select new JObject(
                                                                 new JProperty("ActivitiesID", p.ActivitiesID),
                                                                 new JProperty("ActivitiesName", p.ActivitiesName.ToString().Trim()),
                                                                 new JProperty("ActivitiesImage", p.ActivitiesImage.ToString().Trim()),
                                                                 new JProperty("TimeID", p.TimeID),
                                                                 new JProperty("TimeSort", p.TimeSort),
                                                                 new JProperty("SignupTime", p.SignupTime.ToString().Trim()),
                                                                 new JProperty("QuotaPlaces", p.QuotaPlaces),
                                                                 new JProperty("RemainingPlaces", p.RemainingPlaces),
                                                                 new JProperty("IsSignupTime", p.IsSignupTime.ToString().Trim()),
                                                                 new JProperty("ColumnName_1", p.ColumnName_1.ToString().Trim()),
                                                                 new JProperty("ColumnType_1", p.ColumnType_1.ToString().Trim()),
                                                                 new JProperty("ColumnAnswer_1", p.ColumnAnswer_1.ToString().Trim()),
                                                                 new JProperty("ColumnName_2", p.ColumnName_2.ToString().Trim()),
                                                                 new JProperty("ColumnType_2", p.ColumnType_2.ToString().Trim()),
                                                                 new JProperty("ColumnAnswer_2", p.ColumnAnswer_2.ToString().Trim()),
                                                                 new JProperty("ColumnName_3", p.ColumnName_3.ToString().Trim()),
                                                                 new JProperty("ColumnType_3", p.ColumnType_3.ToString().Trim()),
                                                                 new JProperty("ColumnAnswer_3", p.ColumnAnswer_3.ToString().Trim()),
                                                                 new JProperty("ColumnName_4", p.ColumnName_4.ToString().Trim()),
                                                                 new JProperty("ColumnType_4", p.ColumnType_4.ToString().Trim()),
                                                                 new JProperty("ColumnAnswer_4", p.ColumnAnswer_4.ToString().Trim()),
                                                                 new JProperty("ColumnName_5", p.ColumnName_5.ToString().Trim()),
                                                                 new JProperty("ColumnType_5", p.ColumnType_5.ToString().Trim()),
                                                                 new JProperty("ColumnAnswer_5", p.ColumnAnswer_5.ToString().Trim()),
                                                                 new JProperty("ActivitiesRemarks", p.ActivitiesRemarks.ToString().Trim()),
                                                                 new JProperty("EmployeeName", p.EmployeeName.ToString().Trim()),
                                                                 new JProperty("SignupNo", p.SignupNo.ToString().Trim())
                                                      )
                                                  )
                                              )
                                          ).ToString();
                                break;
                            default:
                                break;
                        }

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 1 - 成功";
                    }
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                  new JProperty("ResultCode", "999001"),
                                  new JProperty("Content", "")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 999001 - 傳入參數不足或傳入參數格式錯誤";
                }
            }
            catch (Exception ex)
            {
                strJson = ex.Message.ToString();

                // 20180321 Hakkinen Add ResultCode
                strResultCode = "ResultCode : Exception - " + ex.Message.ToString();
            }

            // 20180321 Hakkinen Insert System Log Begin -----------------------------------------------
            SqlCommand cmdForSystemLog = new SqlCommand("usp_Activities_SystemLog", SQLConn);
            cmdForSystemLog.CommandType = CommandType.StoredProcedure;

            // Parameter Add
            cmdForSystemLog.Parameters.Add("@Log_AppName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_AppName"].Value = "Activitie";
            cmdForSystemLog.Parameters.Add("@Log_FunctionName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_FunctionName"].Value = "Activities_Signup_Manage";
            cmdForSystemLog.Parameters.Add("@Log_Desc", SqlDbType.NVarChar, 3000);
            cmdForSystemLog.Parameters["@Log_Desc"].Value = strResultCode;
            cmdForSystemLog.ExecuteNonQuery();
            // 20180321 Hakkinen Insert System Log End -------------------------------------------------

            // 關閉連結 SQLConn
            SQLConn.Close();

            return strJson;
        }

        // 確定報名
        [WebMethod]
        public string Activities_Signup_Confirm(string strXml)
        {
            // 20180321 Hakkinen 開始就先設定
            SqlConnection SQLConn = new SqlConnection(strConnString);

            // 開啟 SQLConn
            SQLConn.Open();

            try
            {
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                 * 個人報名
                   <LayoutHeader>
                        <ActivitiesID>9453</ActivitiesID>
                        <SignupModel>1</SignupModel>
                        <SignupPlaces>2</SignupPlaces>
                        <EmployeeNo>1501005</ EmployeeNo>
                        <ColumnAnswer_1>!@#$%^&*(,.gd</ColumnAnswer_1>
                        <ColumnAnswer_2>dABCDddfdgfFGHJUKIL</ColumnAnswer_2>
                        <ColumnAnswer_3>118504146523</ColumnAnswer_3>
                        <ColumnAnswer_4>繁體</ColumnAnswer_4>
                        <ColumnAnswer_5>简体</ColumnAnswer_5>
                   </LayoutHeader>
                 * 眷屬報名
                   <LayoutHeader>
	                    <SignupModel>3</SignupModel>
	                    <FamilyList>
                            <ActivitiesID>9453</ActivitiesID>
                            <SignupPlaces>1</SignupPlaces>
                            <EmployeeNo>1501005</ EmployeeNo>
                            <FamilyNo>11111</FamilyNo>
                            <ColumnAnswer_1>!@#$%^&*(,.gd</ColumnAnswer_1>
                            <ColumnAnswer_2>dABCDddfdgfFGHJUKIL</ColumnAnswer_2>
                            <ColumnAnswer_3>118504146523</ColumnAnswer_3>
                            <ColumnAnswer_4>繁體</ColumnAnswer_4>
                            <ColumnAnswer_5>简体</ColumnAnswer_5>
                        </FamilyList>
                        <FamilyList>
                            <ActivitiesID>9453</ActivitiesID>
                            <SignupPlaces>1</SignupPlaces>
                            <EmployeeNo>1501005</ EmployeeNo>
                            <FamilyNo>22222</FamilyNo>
                            <ColumnAnswer_1>!@#$%^&*(,.gd</ColumnAnswer_1>
                            <ColumnAnswer_2>dABCDddfdgfFGHJUKIL</ColumnAnswer_2>
                            <ColumnAnswer_3>118504146523</ColumnAnswer_3>
                            <ColumnAnswer_4>繁體</ColumnAnswer_4>
                            <ColumnAnswer_5>简体</ColumnAnswer_5>
                        </FamilyList>
                   </LayoutHeader>
                 * 組隊報名
                   <LayoutHeader>
                       <ActivitiesID>9453</ActivitiesID>
                       <SignupModel>5</SignupModel>
                       <EmployeeNo>1501005</ EmployeeNo>
                       <TeamName>杯鮮過火</TeamName>
                       <TeamDept>AI32</TeamDept>
                       <MemberEmployeeNo>1501005, 0909028, 1106953</MemberEmployeeNo>
                   </LayoutHeader>
                 * 時段報名
                   <LayoutHeader>
                        <ActivitiesID>9453</ActivitiesID>
                        <SignupModel>1</SignupModel>
                        <SignupPlaces>2</SignupPlaces>
                        <EmployeeNo>1501005</ EmployeeNo>
                        <ColumnAnswer_1>!@#$%^&*(,.gd</ColumnAnswer_1>
                        <ColumnAnswer_2>dABCDddfdgfFGHJUKIL</ColumnAnswer_2>
                        <ColumnAnswer_3>118504146523</ColumnAnswer_3>
                        <ColumnAnswer_4>11</ColumnAnswer_4>
                        <ColumnAnswer_5>11</ColumnAnswer_5>
                        <TimeID>123</TimeID>
                   </LayoutHeader>
				*/
                #endregion

                string SignupModel = xmlDoc.SelectSingleNode("//SignupModel").InnerText;

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(SignupModel))
                {

                    // Begin 以下為 SQL 執行程式碼

                    // 確定報名的 Store Procedure
                    SqlCommand cmd = new SqlCommand("usp_Activities_Signup_Confirm", SQLConn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // 確認是否名額不足的 Store Procedure
                    SqlCommand cmdCheckSignupPlaces = new SqlCommand("usp_Activities_Signup_Places_Check", SQLConn);
                    cmdCheckSignupPlaces.CommandType = CommandType.StoredProcedure;

                    // 宣告變數
                    string ActivitiesID = string.Empty;
                    string EmployeeNo = string.Empty;
                    string FamilyNo = "0";
                    string ColumnAnswer_1 = string.Empty;
                    string ColumnAnswer_2 = string.Empty;
                    string ColumnAnswer_3 = string.Empty;
                    string ColumnAnswer_4 = string.Empty;
                    string ColumnAnswer_5 = string.Empty;
                    string TimeID = "0";
                    string TeamID = string.Empty;
                    string TeamName = string.Empty;
                    string TeamDept = string.Empty;
                    string MemberEmpNo = string.Empty;
                    int SignupPlaces = 0;
                    int IsFull = 0;

                    switch (SignupModel)
                    {
                        // 個人報名
                        case "1":
                            
                            // 讀取參數值
                            ActivitiesID = xmlDoc.SelectSingleNode("//ActivitiesID").InnerText;
                            SignupPlaces = Convert.ToInt32(xmlDoc.SelectSingleNode("//SignupPlaces").InnerText);
                            EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText;
                            ColumnAnswer_1 = xmlDoc.SelectSingleNode("//ColumnAnswer_1").InnerText;
                            ColumnAnswer_2 = xmlDoc.SelectSingleNode("//ColumnAnswer_2").InnerText;
                            ColumnAnswer_3 = xmlDoc.SelectSingleNode("//ColumnAnswer_3").InnerText;
                            ColumnAnswer_4 = xmlDoc.SelectSingleNode("//ColumnAnswer_4").InnerText;
                            ColumnAnswer_5 = xmlDoc.SelectSingleNode("//ColumnAnswer_5").InnerText;

                            // 輸入確認是否名額不足的 Store Procedure 參數
                            cmdCheckSignupPlaces.Parameters.Clear();
                            cmdCheckSignupPlaces.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                            cmdCheckSignupPlaces.Parameters["@ActivitiesID"].Value = ActivitiesID;
                            cmdCheckSignupPlaces.Parameters.Add("@SignupModel", SqlDbType.Int);
                            cmdCheckSignupPlaces.Parameters["@SignupModel"].Value = SignupModel;
                            cmdCheckSignupPlaces.Parameters.Add("@SignupPlaces", SqlDbType.Int);
                            cmdCheckSignupPlaces.Parameters["@SignupPlaces"].Value = SignupPlaces;
                            cmdCheckSignupPlaces.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 10);
                            cmdCheckSignupPlaces.Parameters["@EmployeeNo"].Value = EmployeeNo.ToString().Trim();
                            cmdCheckSignupPlaces.Parameters.Add("@TimeID", SqlDbType.Int);
                            cmdCheckSignupPlaces.Parameters["@TimeID"].Value = TimeID;
                            cmdCheckSignupPlaces.Parameters.Add("@IsFull", SqlDbType.Int).Direction = ParameterDirection.Output;
                            cmdCheckSignupPlaces.ExecuteNonQuery();

                            // 設定是否額滿參數
                            IsFull = Convert.ToInt32(cmdCheckSignupPlaces.Parameters["@IsFull"].Value);

                            // 如果已額滿會報餘額不足的 Error 訊息
                            if (IsFull == 0)
                            {
                                // Parameter 設定
                                cmd.Parameters.Clear();
                                cmd.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                                cmd.Parameters["@ActivitiesID"].Value = ActivitiesID;
                                cmd.Parameters.Add("@SignupModel", SqlDbType.Int);
                                cmd.Parameters["@SignupModel"].Value = SignupModel;
                                cmd.Parameters.Add("@SignupPlaces", SqlDbType.Int);
                                cmd.Parameters["@SignupPlaces"].Value = SignupPlaces;
                                cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 10);
                                cmd.Parameters["@EmployeeNo"].Value = EmployeeNo.ToString().Trim();
                                cmd.Parameters.Add("@ColumnAnswer_1", SqlDbType.NVarChar, 100);
                                cmd.Parameters["@ColumnAnswer_1"].Value = ColumnAnswer_1.ToString().Trim();
                                cmd.Parameters.Add("@ColumnAnswer_2", SqlDbType.NVarChar, 100);
                                cmd.Parameters["@ColumnAnswer_2"].Value = ColumnAnswer_2.ToString().Trim();
                                cmd.Parameters.Add("@ColumnAnswer_3", SqlDbType.NVarChar, 100);
                                cmd.Parameters["@ColumnAnswer_3"].Value = ColumnAnswer_3.ToString().Trim();
                                cmd.Parameters.Add("@ColumnAnswer_4", SqlDbType.NVarChar, 100);
                                cmd.Parameters["@ColumnAnswer_4"].Value = ColumnAnswer_4.ToString().Trim();
                                cmd.Parameters.Add("@ColumnAnswer_5", SqlDbType.NVarChar, 100);
                                cmd.Parameters["@ColumnAnswer_5"].Value = ColumnAnswer_5.ToString().Trim();
                                cmd.Parameters.Add("@FamilyNo", SqlDbType.NVarChar, 50);
                                cmd.Parameters["@FamilyNo"].Value = FamilyNo.ToString().Trim();
                                cmd.Parameters.Add("@TimeID", SqlDbType.Int);
                                cmd.Parameters["@TimeID"].Value = TimeID;
                                cmd.Parameters.Add("@TeamID", SqlDbType.NVarChar);
                                cmd.Parameters["@TeamID"].Value = TeamID.ToString().Trim();
                                cmd.Parameters.Add("@TeamName", SqlDbType.NVarChar);
                                cmd.Parameters["@TeamName"].Value = TeamName.ToString().Trim();
                                cmd.Parameters.Add("@TeamDept", SqlDbType.NVarChar);
                                cmd.Parameters["@TeamDept"].Value = TeamDept.ToString().Trim();
                                cmd.Parameters.Add("@MemberEmpNo", SqlDbType.NVarChar);
                                cmd.Parameters["@MemberEmpNo"].Value = MemberEmpNo.ToString().Trim();
                                cmd.ExecuteNonQuery();

                                // 已完成報名
                                strJson = new JObject(
                                              new JProperty("ResultCode", "045911")
                                          ).ToString();

                                // 20180321 Hakkinen Add ResultCode
                                strResultCode = "ResultCode : 045911 - 已完成報名";
                            }
                            else
                            {
                                // 報名失敗，剩餘名額不足
                                strJson = new JObject(
                                              new JProperty("ResultCode", "045912"),
                                              new JProperty("Content", "")
                                          ).ToString();

                                // 20180321 Hakkinen Add ResultCode
                                strResultCode = "ResultCode : 045912 - 報名失敗，剩餘名額不足";
                            }
                            break;

                        // 眷屬報名
                        case "3":
                            XmlNodeList xnList = xmlDoc.SelectNodes("//FamilyList");
                            
                            int counter = 0;
                            int SignupCount = xnList.Count;
                            bool IsFlase = false;

                            foreach (XmlNode xn in xnList)
                            {
                                // 設定參數
                                ActivitiesID = xn["ActivitiesID"].InnerText;
                                SignupPlaces = Convert.ToInt32(xn["SignupPlaces"].InnerText);
                                EmployeeNo = xn["EmployeeNo"].InnerText;
                                FamilyNo = xn["FamilyNo"].InnerText;
                                ColumnAnswer_1 = xn["ColumnAnswer_1"].InnerText;
                                ColumnAnswer_2 = xn["ColumnAnswer_2"].InnerText;
                                ColumnAnswer_3 = xn["ColumnAnswer_3"].InnerText;
                                ColumnAnswer_4 = xn["ColumnAnswer_4"].InnerText;
                                ColumnAnswer_5 = xn["ColumnAnswer_5"].InnerText;

                                if (counter == 0)
                                {
                                    cmdCheckSignupPlaces.Parameters.Clear();
                                    cmdCheckSignupPlaces.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                                    cmdCheckSignupPlaces.Parameters["@ActivitiesID"].Value = ActivitiesID;
                                    cmdCheckSignupPlaces.Parameters.Add("@SignupModel", SqlDbType.Int);
                                    cmdCheckSignupPlaces.Parameters["@SignupModel"].Value = SignupModel;
                                    cmdCheckSignupPlaces.Parameters.Add("@SignupPlaces", SqlDbType.Int);
                                    cmdCheckSignupPlaces.Parameters["@SignupPlaces"].Value = SignupCount;
                                    cmdCheckSignupPlaces.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 10);
                                    cmdCheckSignupPlaces.Parameters["@EmployeeNo"].Value = EmployeeNo.ToString().Trim();
                                    cmdCheckSignupPlaces.Parameters.Add("@TimeID", SqlDbType.Int);
                                    cmdCheckSignupPlaces.Parameters["@TimeID"].Value = TimeID;
                                    cmdCheckSignupPlaces.Parameters.Add("@IsFull", SqlDbType.Int).Direction = ParameterDirection.Output;
                                    cmdCheckSignupPlaces.ExecuteNonQuery();

                                    IsFull = Convert.ToInt32(cmdCheckSignupPlaces.Parameters["@IsFull"].Value);
                                }

                                if (IsFull == 0)
                                {
                                    if (counter == 0)
                                    {
                                        SqlCommand cmdBefore = new SqlCommand("usp_Activities_Signup_Confirm_Before", SQLConn);
                                        cmdBefore.CommandType = CommandType.StoredProcedure;
                                        cmdBefore.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                                        cmdBefore.Parameters["@ActivitiesID"].Value = ActivitiesID;
                                        cmdBefore.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 10);
                                        cmdBefore.Parameters["@EmployeeNo"].Value = EmployeeNo.ToString().Trim();
                                        cmdBefore.ExecuteNonQuery();
                                    }

                                    // Parameter 設定
                                    cmd.Parameters.Clear();
                                    cmd.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                                    cmd.Parameters["@ActivitiesID"].Value = ActivitiesID;
                                    cmd.Parameters.Add("@SignupModel", SqlDbType.Int);
                                    cmd.Parameters["@SignupModel"].Value = SignupModel;
                                    cmd.Parameters.Add("@SignupPlaces", SqlDbType.Int);
                                    cmd.Parameters["@SignupPlaces"].Value = SignupPlaces;
                                    cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 10);
                                    cmd.Parameters["@EmployeeNo"].Value = EmployeeNo.ToString().Trim();
                                    cmd.Parameters.Add("@ColumnAnswer_1", SqlDbType.NVarChar, 100);
                                    cmd.Parameters["@ColumnAnswer_1"].Value = ColumnAnswer_1.ToString().Trim();
                                    cmd.Parameters.Add("@ColumnAnswer_2", SqlDbType.NVarChar, 100);
                                    cmd.Parameters["@ColumnAnswer_2"].Value = ColumnAnswer_2.ToString().Trim();
                                    cmd.Parameters.Add("@ColumnAnswer_3", SqlDbType.NVarChar, 100);
                                    cmd.Parameters["@ColumnAnswer_3"].Value = ColumnAnswer_3.ToString().Trim();
                                    cmd.Parameters.Add("@ColumnAnswer_4", SqlDbType.NVarChar, 100);
                                    cmd.Parameters["@ColumnAnswer_4"].Value = ColumnAnswer_4.ToString().Trim();
                                    cmd.Parameters.Add("@ColumnAnswer_5", SqlDbType.NVarChar, 100);
                                    cmd.Parameters["@ColumnAnswer_5"].Value = ColumnAnswer_5.ToString().Trim();
                                    cmd.Parameters.Add("@FamilyNo", SqlDbType.NVarChar, 50);
                                    cmd.Parameters["@FamilyNo"].Value = FamilyNo.ToString().Trim();
                                    cmd.Parameters.Add("@TimeID", SqlDbType.Int);
                                    cmd.Parameters["@TimeID"].Value = TimeID;
                                    cmd.Parameters.Add("@TeamID", SqlDbType.NVarChar);
                                    cmd.Parameters["@TeamID"].Value = TeamID.ToString().Trim();
                                    cmd.Parameters.Add("@TeamName", SqlDbType.NVarChar);
                                    cmd.Parameters["@TeamName"].Value = TeamName.ToString().Trim();
                                    cmd.Parameters.Add("@TeamDept", SqlDbType.NVarChar);
                                    cmd.Parameters["@TeamDept"].Value = TeamDept.ToString().Trim();
                                    cmd.Parameters.Add("@MemberEmpNo", SqlDbType.NVarChar);
                                    cmd.Parameters["@MemberEmpNo"].Value = MemberEmpNo.ToString().Trim();
                                    cmd.ExecuteNonQuery();
                                    counter++;
                                }
                                else
                                {
                                    IsFlase = true;
                                    break;
                                }
                            }
                            // 關閉連結 SQLConn
                            // SQLConn.Close();

                            if (IsFlase == false)
                            {
                                // 已完成報名
                                strJson = new JObject(
                                              new JProperty("ResultCode", "045911")
                                          ).ToString();

                                // 20180321 Hakkinen Add ResultCode
                                strResultCode = "ResultCode : 045911 - 已完成報名";
                            }
                            else
                            {
                                // 報名失敗，剩餘名額不足
                                strJson = new JObject(
                                              new JProperty("ResultCode", "045912"),
                                              new JProperty("Content", "")
                                          ).ToString();

                                // 20180321 Hakkinen Add ResultCode
                                strResultCode = "ResultCode : 045912 - 報名失敗，剩餘名額不足";
                            }
                            break;

                        // 組隊報名
                        case "4":
                            ActivitiesID = xmlDoc.SelectSingleNode("//ActivitiesID").InnerText;
                            EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText;
                            TeamName = xmlDoc.SelectSingleNode("//TeamName").InnerText;
                            TeamDept = xmlDoc.SelectSingleNode("//TeamDept").InnerText;
                            MemberEmpNo = xmlDoc.SelectSingleNode("//MemberEmpNo").InnerText;

                            // 撈取 TeamID
                            string strSQL = " Select TeamID From Active_Team_ID_View with(nolock) ";
                            SqlCommand cmdTeamID = new SqlCommand(strSQL, SQLConn);
                            cmdTeamID.CommandType = CommandType.Text;
                            cmdTeamID.ExecuteNonQuery();

                            // 設定 Table 取值
                            DataTable dt = new DataTable();
                            SqlDataAdapter da = new SqlDataAdapter();
                            da.SelectCommand = cmdTeamID;
                            da.Fill(dt);

                            // 設值 TeamID
                            TeamID = dt.Rows[0]["TeamID"].ToString().Trim();

                            cmdCheckSignupPlaces.Parameters.Clear();
                            cmdCheckSignupPlaces.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                            cmdCheckSignupPlaces.Parameters["@ActivitiesID"].Value = ActivitiesID;
                            cmdCheckSignupPlaces.Parameters.Add("@SignupModel", SqlDbType.Int);
                            cmdCheckSignupPlaces.Parameters["@SignupModel"].Value = SignupModel;
                            cmdCheckSignupPlaces.Parameters.Add("@SignupPlaces", SqlDbType.Int);
                            cmdCheckSignupPlaces.Parameters["@SignupPlaces"].Value = SignupPlaces;
                            cmdCheckSignupPlaces.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 10);
                            cmdCheckSignupPlaces.Parameters["@EmployeeNo"].Value = EmployeeNo.ToString().Trim();
                            cmdCheckSignupPlaces.Parameters.Add("@TimeID", SqlDbType.Int);
                            cmdCheckSignupPlaces.Parameters["@TimeID"].Value = TimeID;
                            cmdCheckSignupPlaces.Parameters.Add("@IsFull", SqlDbType.Int).Direction = ParameterDirection.Output;
                            cmdCheckSignupPlaces.ExecuteNonQuery();

                            IsFull = Convert.ToInt32(cmdCheckSignupPlaces.Parameters["@IsFull"].Value);

                            if (IsFull == 0)
                            {
                                string[] MemberEmpNoArray = MemberEmpNo.Split(',');

                                for (int i = 0; i < MemberEmpNoArray.Length; i++)
                                {
                                    // Parameter 設定
                                    cmd.Parameters.Clear();
                                    cmd.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                                    cmd.Parameters["@ActivitiesID"].Value = ActivitiesID;
                                    cmd.Parameters.Add("@SignupModel", SqlDbType.Int);
                                    cmd.Parameters["@SignupModel"].Value = SignupModel;
                                    cmd.Parameters.Add("@SignupPlaces", SqlDbType.Int);
                                    cmd.Parameters["@SignupPlaces"].Value = SignupPlaces;
                                    cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 10);
                                    cmd.Parameters["@EmployeeNo"].Value = EmployeeNo.ToString().Trim();
                                    cmd.Parameters.Add("@ColumnAnswer_1", SqlDbType.NVarChar, 100);
                                    cmd.Parameters["@ColumnAnswer_1"].Value = ColumnAnswer_1.ToString().Trim();
                                    cmd.Parameters.Add("@ColumnAnswer_2", SqlDbType.NVarChar, 100);
                                    cmd.Parameters["@ColumnAnswer_2"].Value = ColumnAnswer_2.ToString().Trim();
                                    cmd.Parameters.Add("@ColumnAnswer_3", SqlDbType.NVarChar, 100);
                                    cmd.Parameters["@ColumnAnswer_3"].Value = ColumnAnswer_3.ToString().Trim();
                                    cmd.Parameters.Add("@ColumnAnswer_4", SqlDbType.NVarChar, 100);
                                    cmd.Parameters["@ColumnAnswer_4"].Value = ColumnAnswer_4.ToString().Trim();
                                    cmd.Parameters.Add("@ColumnAnswer_5", SqlDbType.NVarChar, 100);
                                    cmd.Parameters["@ColumnAnswer_5"].Value = ColumnAnswer_5.ToString().Trim();
                                    cmd.Parameters.Add("@FamilyNo", SqlDbType.NVarChar, 50);
                                    cmd.Parameters["@FamilyNo"].Value = FamilyNo.ToString().Trim();
                                    cmd.Parameters.Add("@TimeID", SqlDbType.Int);
                                    cmd.Parameters["@TimeID"].Value = TimeID;
                                    cmd.Parameters.Add("@TeamID", SqlDbType.NVarChar);
                                    cmd.Parameters["@TeamID"].Value = TeamID.ToString().Trim();
                                    cmd.Parameters.Add("@TeamName", SqlDbType.NVarChar);
                                    cmd.Parameters["@TeamName"].Value = TeamName.ToString().Trim();
                                    cmd.Parameters.Add("@TeamDept", SqlDbType.NVarChar);
                                    cmd.Parameters["@TeamDept"].Value = TeamDept.ToString().Trim();
                                    cmd.Parameters.Add("@MemberEmpNo", SqlDbType.NVarChar);
                                    cmd.Parameters["@MemberEmpNo"].Value = MemberEmpNoArray[i].ToString().Trim();
                                    cmd.ExecuteNonQuery();
                                }

                                // 已完成報名
                                strJson = new JObject(
                                              new JProperty("ResultCode", "045911")
                                          ).ToString();

                                // 20180321 Hakkinen Add ResultCode
                                strResultCode = "ResultCode : 045911 - 已完成報名";
                            }
                            else
                            {
                                // 報名失敗，剩餘名額不足
                                strJson = new JObject(
                                              new JProperty("ResultCode", "045912"),
                                              new JProperty("Content", "")
                                          ).ToString();

                                // 20180321 Hakkinen Add ResultCode
                                strResultCode = "ResultCode : 045912 - 報名失敗，剩餘名額不足";
                            }
                            break;

                        // 時段報名
                        case "5":
                            ActivitiesID = xmlDoc.SelectSingleNode("//ActivitiesID").InnerText;
                            SignupPlaces = Convert.ToInt32(xmlDoc.SelectSingleNode("//SignupPlaces").InnerText);
                            EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText;
                            ColumnAnswer_1 = xmlDoc.SelectSingleNode("//ColumnAnswer_1").InnerText;
                            ColumnAnswer_2 = xmlDoc.SelectSingleNode("//ColumnAnswer_2").InnerText;
                            ColumnAnswer_3 = xmlDoc.SelectSingleNode("//ColumnAnswer_3").InnerText;
                            ColumnAnswer_4 = xmlDoc.SelectSingleNode("//ColumnAnswer_4").InnerText;
                            ColumnAnswer_5 = xmlDoc.SelectSingleNode("//ColumnAnswer_5").InnerText;
                            TimeID = xmlDoc.SelectSingleNode("//TimeID").InnerText;

                            cmdCheckSignupPlaces.Parameters.Clear();
                            cmdCheckSignupPlaces.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                            cmdCheckSignupPlaces.Parameters["@ActivitiesID"].Value = ActivitiesID;
                            cmdCheckSignupPlaces.Parameters.Add("@SignupModel", SqlDbType.Int);
                            cmdCheckSignupPlaces.Parameters["@SignupModel"].Value = SignupModel;
                            cmdCheckSignupPlaces.Parameters.Add("@SignupPlaces", SqlDbType.Int);
                            cmdCheckSignupPlaces.Parameters["@SignupPlaces"].Value = SignupPlaces;
                            cmdCheckSignupPlaces.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 10);
                            cmdCheckSignupPlaces.Parameters["@EmployeeNo"].Value = EmployeeNo.ToString().Trim();
                            cmdCheckSignupPlaces.Parameters.Add("@TimeID", SqlDbType.Int);
                            cmdCheckSignupPlaces.Parameters["@TimeID"].Value = TimeID;
                            cmdCheckSignupPlaces.Parameters.Add("@IsFull", SqlDbType.Int).Direction = ParameterDirection.Output;
                            cmdCheckSignupPlaces.ExecuteNonQuery();

                            IsFull = Convert.ToInt32(cmdCheckSignupPlaces.Parameters["@IsFull"].Value);

                            if (IsFull == 0)
                            {

                                // Parameter 設定
                                cmd.Parameters.Clear();
                                cmd.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                                cmd.Parameters["@ActivitiesID"].Value = ActivitiesID;
                                cmd.Parameters.Add("@SignupModel", SqlDbType.Int);
                                cmd.Parameters["@SignupModel"].Value = SignupModel;
                                cmd.Parameters.Add("@SignupPlaces", SqlDbType.Int);
                                cmd.Parameters["@SignupPlaces"].Value = SignupPlaces;
                                cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 10);
                                cmd.Parameters["@EmployeeNo"].Value = EmployeeNo.ToString().Trim();
                                cmd.Parameters.Add("@ColumnAnswer_1", SqlDbType.NVarChar, 100);
                                cmd.Parameters["@ColumnAnswer_1"].Value = ColumnAnswer_1.ToString().Trim();
                                cmd.Parameters.Add("@ColumnAnswer_2", SqlDbType.NVarChar, 100);
                                cmd.Parameters["@ColumnAnswer_2"].Value = ColumnAnswer_2.ToString().Trim();
                                cmd.Parameters.Add("@ColumnAnswer_3", SqlDbType.NVarChar, 100);
                                cmd.Parameters["@ColumnAnswer_3"].Value = ColumnAnswer_3.ToString().Trim();
                                cmd.Parameters.Add("@ColumnAnswer_4", SqlDbType.NVarChar, 100);
                                cmd.Parameters["@ColumnAnswer_4"].Value = ColumnAnswer_4.ToString().Trim();
                                cmd.Parameters.Add("@ColumnAnswer_5", SqlDbType.NVarChar, 100);
                                cmd.Parameters["@ColumnAnswer_5"].Value = ColumnAnswer_5.ToString().Trim();
                                cmd.Parameters.Add("@FamilyNo", SqlDbType.NVarChar, 50);
                                cmd.Parameters["@FamilyNo"].Value = FamilyNo.ToString().Trim();
                                cmd.Parameters.Add("@TimeID", SqlDbType.Int);
                                cmd.Parameters["@TimeID"].Value = TimeID;
                                cmd.Parameters.Add("@TeamID", SqlDbType.NVarChar);
                                cmd.Parameters["@TeamID"].Value = TeamID.ToString().Trim();
                                cmd.Parameters.Add("@TeamName", SqlDbType.NVarChar);
                                cmd.Parameters["@TeamName"].Value = TeamName.ToString().Trim();
                                cmd.Parameters.Add("@TeamDept", SqlDbType.NVarChar);
                                cmd.Parameters["@TeamDept"].Value = TeamDept.ToString().Trim();
                                cmd.Parameters.Add("@MemberEmpNo", SqlDbType.NVarChar);
                                cmd.Parameters["@MemberEmpNo"].Value = MemberEmpNo.ToString().Trim();
                                cmd.ExecuteNonQuery();

                                // 已完成報名
                                strJson = new JObject(
                                              new JProperty("ResultCode", "045911")
                                          ).ToString();

                                // 20180321 Hakkinen Add ResultCode
                                strResultCode = "ResultCode : 045911 - 已完成報名";
                            }
                            else
                            {
                                // 報名失敗，剩餘名額不足
                                strJson = new JObject(
                                              new JProperty("ResultCode", "045912"),
                                              new JProperty("Content", "")
                                          ).ToString();

                                // 20180321 Hakkinen Add ResultCode
                                strResultCode = "ResultCode : 045912 - 報名失敗，剩餘名額不足";
                            }
                            break;
                    }
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                  new JProperty("ResultCode", "999001"),
                                  new JProperty("Content", "")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 999001 - 傳入參數不足或傳入參數格式錯誤";
                }
            }
            catch (Exception ex)
            {
                // 報名失敗
                strJson = ex.Message.ToString();

                // 20180321 Hakkinen Add ResultCode
                strResultCode = "ResultCode : Exception - " + ex.Message.ToString();
            }

            // 20180321 Hakkinen Insert System Log Begin -----------------------------------------------
            SqlCommand cmdForSystemLog = new SqlCommand("usp_Activities_SystemLog", SQLConn);
            cmdForSystemLog.CommandType = CommandType.StoredProcedure;

            // Parameter Add
            cmdForSystemLog.Parameters.Add("@Log_AppName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_AppName"].Value = "Activitie";
            cmdForSystemLog.Parameters.Add("@Log_FunctionName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_FunctionName"].Value = "Activities_Signup_Confirm";
            cmdForSystemLog.Parameters.Add("@Log_Desc", SqlDbType.NVarChar, 3000);
            cmdForSystemLog.Parameters["@Log_Desc"].Value = strResultCode;
            cmdForSystemLog.ExecuteNonQuery();

            SQLConn.Close();
            // 20180321 Hakkinen Insert System Log End -------------------------------------------------

            // 關閉連結 SQLConn
            SQLConn.Close();

            return strJson;
        }

        // 取消報名
        [WebMethod]
        public string Activities_Signup_Cancel(string strXml)
        {
            // 20180321 Hakkinen 開始就先設定
            SqlConnection SQLConn = new SqlConnection(strConnString);

            // 開啟 SQLConn
            SQLConn.Open();

            try
            {
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                     <LayoutHeader>
                        <ActivitiesID>9453</ActivitiesID>
                        <SignupNo>9453</SignupNo>
                        <SignupModel>3</SignupModel>
                        <EmployeeNo>1501005</ EmployeeNo>
                    </LayoutHeader>                
				*/
                #endregion

                // 設定傳入參數
                string ActivitiesID = xmlDoc.SelectSingleNode("//ActivitiesID").InnerText; // 活動編號
                string SignupNo = xmlDoc.SelectSingleNode("//SignupNo").InnerText; // 報名編號
                string SignupModel = xmlDoc.SelectSingleNode("//SignupModel").InnerText; // 報名方式
                string EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText; // 員工工號

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(ActivitiesID) && !string.IsNullOrEmpty(SignupModel) && !string.IsNullOrEmpty(EmployeeNo) && ( (SignupModel != "3" && !string.IsNullOrEmpty(SignupNo)) || (SignupModel == "3")) )
                {
                    // Begin 以下為 SQL 執行程式碼

                    // 設定執行參數
                    SqlCommand cmd = new SqlCommand("usp_Activities_Signup_Cancel", SQLConn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameter 設定
                    cmd.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                    cmd.Parameters["@ActivitiesID"].Value = ActivitiesID;
                    cmd.Parameters.Add("@SignupNo", SqlDbType.NVarChar, 200);
                    cmd.Parameters["@SignupNo"].Value = SignupNo.ToString().Trim();
                    cmd.Parameters.Add("@SignupModel", SqlDbType.Int);
                    cmd.Parameters["@SignupModel"].Value = SignupModel;
                    cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@EmployeeNo"].Value = EmployeeNo.ToString().Trim();

                    cmd.ExecuteNonQuery();

                    // 報名已取消
                    strJson = new JObject(
                                  new JProperty("ResultCode", "045913")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 045913 - 報名已取消";
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                  new JProperty("ResultCode", "999001"),
                                  new JProperty("Content", "")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 999001 - 傳入參數不足或傳入參數格式錯誤";
                }
            }
            catch (Exception ex)
            {
                // 報名取消失敗
                strJson = new JObject(
                              new JProperty("ResultCode", "045914"),
                              new JProperty("Content", ex.Message.ToString())
                          ).ToString();

                // 20180321 Hakkinen Add ResultCode
                strResultCode = "ResultCode : 045914 - 報名取消失敗, " + ex.Message.ToString();
            }

            // 20180321 Hakkinen Insert System Log Begin -----------------------------------------------
            SqlCommand cmdForSystemLog = new SqlCommand("usp_Activities_SystemLog", SQLConn);
            cmdForSystemLog.CommandType = CommandType.StoredProcedure;

            // Parameter Add
            cmdForSystemLog.Parameters.Add("@Log_AppName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_AppName"].Value = "Activitie";
            cmdForSystemLog.Parameters.Add("@Log_FunctionName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_FunctionName"].Value = "Activities_Signup_Cancel";
            cmdForSystemLog.Parameters.Add("@Log_Desc", SqlDbType.NVarChar, 3000);
            cmdForSystemLog.Parameters["@Log_Desc"].Value = strResultCode;
            cmdForSystemLog.ExecuteNonQuery();
            // 20180321 Hakkinen Insert System Log End -------------------------------------------------

            // 關閉連結 SQLConn
            SQLConn.Close();

            return strJson;
        }

        // 眷屬報名介面 ( 報名相關訊息 )
        [WebMethod]
        public string Activities_Signup_Family(string strXml)
        {
            // 20180321 Hakkinen 開始就先設定
            SqlConnection SQLConn = new SqlConnection(strConnString);

            // 開啟 SQLConn
            SQLConn.Open();

            try
            {
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                     <LayoutHeader><ActivitiesID>1999<ActivitiesID><EmployeeNo>1501005</EmployeeNo><IsSignup>N</IsSignup></LayoutHeader>
                     <LayoutHeader><ActivitiesID>1999<ActivitiesID><EmployeeNo>1501005</EmployeeNo><IsSignup>Y</IsSignup></LayoutHeader>     
				*/
                #endregion

                // 設定傳入參數
                string ActivitiesID = xmlDoc.SelectSingleNode("//ActivitiesID").InnerText; // 活動編號
                string EmployeeNo = xmlDoc.SelectSingleNode("//EmployeeNo").InnerText; // 員工工號
                string IsSignup = xmlDoc.SelectSingleNode("//IsSignup").InnerText; // 是否報名

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(ActivitiesID) && !string.IsNullOrEmpty(EmployeeNo) && !string.IsNullOrEmpty(IsSignup))
                {
                    List<ActivitiesSignupFamilyInfo> ListActivitiesSignupFamilyInfo = new List<ActivitiesSignupFamilyInfo>();

                    // Begin 以下為 SQL 執行程式碼

                    // 設定執行參數
                    DataTable DataTableActivitiesSignupFamilyInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand("usp_Activities_Signup_Family", SQLConn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameter 設定
                    cmd.Parameters.Add("@ActivitiesID", SqlDbType.Int);
                    cmd.Parameters["@ActivitiesID"].Value = ActivitiesID;
                    cmd.Parameters.Add("@EmployeeNo", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@EmployeeNo"].Value = EmployeeNo.ToString().Trim();
                    cmd.Parameters.Add("@IsSignup", SqlDbType.NVarChar, 1);
                    cmd.Parameters["@IsSignup"].Value = IsSignup.ToString().Trim();

                    cmd.ExecuteNonQuery();

                    // 設定 Table 取值
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTableActivitiesSignupFamilyInfo);

                    // 判斷 Table 是否有值
                    if (DataTableActivitiesSignupFamilyInfo != null && DataTableActivitiesSignupFamilyInfo.Rows.Count > 0)
                    {
                        if (IsSignup != "Y")
                        {
                            for (int i = 0; i < DataTableActivitiesSignupFamilyInfo.Rows.Count; i++)
                            {
                                ActivitiesSignupFamilyInfo ActivitiesSignupFamilyInfo = new ActivitiesSignupFamilyInfo();
                                ActivitiesSignupFamilyInfo.ActivitiesID = (int)DataTableActivitiesSignupFamilyInfo.Rows[0]["ActivitiesID"];
                                ActivitiesSignupFamilyInfo.ActivitiesName = DataTableActivitiesSignupFamilyInfo.Rows[i]["ActivitiesName"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ActivitiesImage = DataTableActivitiesSignupFamilyInfo.Rows[i]["ActivitiesImage"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyName = DataTableActivitiesSignupFamilyInfo.Rows[i]["FamilyName"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyID = DataTableActivitiesSignupFamilyInfo.Rows[i]["FamilyID"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyNo = DataTableActivitiesSignupFamilyInfo.Rows[i]["FamilyNo"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyBirthday = DataTableActivitiesSignupFamilyInfo.Rows[i]["FamilyBirthday"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyGenderDesc = DataTableActivitiesSignupFamilyInfo.Rows[i]["GenderDesc"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyRelationshipDesc = DataTableActivitiesSignupFamilyInfo.Rows[i]["RelationshipDesc"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyGender = (int)DataTableActivitiesSignupFamilyInfo.Rows[i]["FamilyGender"];
                                ActivitiesSignupFamilyInfo.FamilyRelationship = (int)DataTableActivitiesSignupFamilyInfo.Rows[i]["FamilyRelationship"];
                                ActivitiesSignupFamilyInfo.ColumnName_1 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnName_1"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnType_1 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnType_1"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnItem_1 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnItem_1"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnName_2 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnName_2"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnType_2 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnType_2"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnItem_2 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnItem_2"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnName_3 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnName_3"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnType_3 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnType_3"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnItem_3 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnItem_3"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnName_4 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnName_4"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnType_4 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnType_4"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnItem_4 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnItem_4"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnName_5 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnName_5"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnType_5 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnType_5"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnItem_5 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnItem_5"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ActivitiesRemarks = DataTableActivitiesSignupFamilyInfo.Rows[i]["ActivitiesRemarks"].ToString().Trim();
                                ListActivitiesSignupFamilyInfo.Add(ActivitiesSignupFamilyInfo);
                            }

                            // 將資料存入 Json 格式
                            strJson = new JObject(
                                          new JProperty("ResultCode", "1"),
                                          new JProperty("Content",
                                              new JArray(
                                // 使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                                  from p in ListActivitiesSignupFamilyInfo
                                                  select new JObject(
                                                             new JProperty("EmployeeDept", p.ActivitiesID),
                                                             new JProperty("ActivitiesName", p.ActivitiesName.ToString().Trim()),
                                                             new JProperty("ActivitiesImage", p.ActivitiesImage.ToString().Trim()),
                                                             new JProperty("FamilyName", p.FamilyName.ToString().Trim()),
                                                             new JProperty("FamilyID", p.FamilyID.ToString().Trim()),
                                                             new JProperty("FamilyNo", p.FamilyNo.ToString().Trim()),
                                                             new JProperty("FamilyBirthday", p.FamilyBirthday.ToString().Trim()),
                                                             new JProperty("FamilyGenderDesc", p.FamilyGenderDesc.ToString().Trim()),
                                                             new JProperty("FamilyGender", p.FamilyGender),
                                                             new JProperty("FamilyRelationshipDesc", p.FamilyRelationshipDesc.ToString().Trim()),
                                                             new JProperty("FamilyRelationship", p.FamilyRelationship),
                                                             new JProperty("ColumnName_1", p.ColumnName_1.ToString().Trim()),
                                                             new JProperty("ColumnType_1", p.ColumnType_1.ToString().Trim()),
                                                             new JProperty("ColumnItem_1", p.ColumnItem_1.ToString().Trim()),
                                                             new JProperty("ColumnName_2", p.ColumnName_2.ToString().Trim()),
                                                             new JProperty("ColumnType_2", p.ColumnType_2.ToString().Trim()),
                                                             new JProperty("ColumnItem_2", p.ColumnItem_2.ToString().Trim()),
                                                             new JProperty("ColumnName_3", p.ColumnName_3.ToString().Trim()),
                                                             new JProperty("ColumnType_3", p.ColumnType_3.ToString().Trim()),
                                                             new JProperty("ColumnItem_3", p.ColumnItem_3.ToString().Trim()),
                                                             new JProperty("ColumnName_4", p.ColumnName_4.ToString().Trim()),
                                                             new JProperty("ColumnType_4", p.ColumnType_4.ToString().Trim()),
                                                             new JProperty("ColumnItem_4", p.ColumnItem_4.ToString().Trim()),
                                                             new JProperty("ColumnName_5", p.ColumnName_5.ToString().Trim()),
                                                             new JProperty("ColumnType_5", p.ColumnType_5.ToString().Trim()),
                                                             new JProperty("ColumnItem_5", p.ColumnItem_5.ToString().Trim()),
                                                             new JProperty("ActivitiesRemarks", p.ActivitiesRemarks.ToString().Trim())
                                                  )
                                              )
                                          )
                                      ).ToString();
                        }
                        else
                        {
                            for (int i = 0; i < DataTableActivitiesSignupFamilyInfo.Rows.Count; i++)
                            {
                                ActivitiesSignupFamilyInfo ActivitiesSignupFamilyInfo = new ActivitiesSignupFamilyInfo();
                                ActivitiesSignupFamilyInfo.ActivitiesID = (int)DataTableActivitiesSignupFamilyInfo.Rows[0]["ActivitiesID"];
                                ActivitiesSignupFamilyInfo.ActivitiesName = DataTableActivitiesSignupFamilyInfo.Rows[i]["ActivitiesName"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ActivitiesImage = DataTableActivitiesSignupFamilyInfo.Rows[i]["ActivitiesImage"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyName = DataTableActivitiesSignupFamilyInfo.Rows[i]["FamilyName"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyID = DataTableActivitiesSignupFamilyInfo.Rows[i]["FamilyID"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyNo = DataTableActivitiesSignupFamilyInfo.Rows[i]["FamilyNo"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyBirthday = DataTableActivitiesSignupFamilyInfo.Rows[i]["FamilyBirthday"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyGenderDesc = DataTableActivitiesSignupFamilyInfo.Rows[i]["GenderDesc"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyRelationshipDesc = DataTableActivitiesSignupFamilyInfo.Rows[i]["RelationshipDesc"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.FamilyGender = (int)DataTableActivitiesSignupFamilyInfo.Rows[i]["FamilyGender"];
                                ActivitiesSignupFamilyInfo.FamilyRelationship = (int)DataTableActivitiesSignupFamilyInfo.Rows[i]["FamilyRelationship"];
                                ActivitiesSignupFamilyInfo.IsSignup = DataTableActivitiesSignupFamilyInfo.Rows[i]["IsSignup"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnName_1 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnName_1"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnType_1 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnType_1"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnItem_1 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnItem_1"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnAnswer_1 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnAnswer_1"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnName_2 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnName_2"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnType_2 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnType_2"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnItem_2 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnItem_2"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnAnswer_2 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnAnswer_2"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnName_3 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnName_3"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnType_3 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnType_3"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnItem_3 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnItem_3"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnAnswer_3 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnAnswer_3"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnName_4 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnName_4"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnType_4 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnType_4"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnItem_4 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnItem_4"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnAnswer_4 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnAnswer_4"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnName_5 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnName_5"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnType_5 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnType_5"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnItem_5 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnItem_5"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ColumnAnswer_5 = DataTableActivitiesSignupFamilyInfo.Rows[i]["ColumnAnswer_5"].ToString().Trim();
                                ActivitiesSignupFamilyInfo.ActivitiesRemarks = DataTableActivitiesSignupFamilyInfo.Rows[i]["ActivitiesRemarks"].ToString().Trim();
                                ListActivitiesSignupFamilyInfo.Add(ActivitiesSignupFamilyInfo);
                            }

                            // 將資料存入 Json 格式
                            strJson = new JObject(
                                          new JProperty("ResultCode", "1"),
                                          new JProperty("Content",
                                              new JArray(
                                // 使用 Linq to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                                  from p in ListActivitiesSignupFamilyInfo
                                                  select new JObject(
                                                             new JProperty("EmployeeDept", p.ActivitiesID),
                                                             new JProperty("ActivitiesName", p.ActivitiesName.ToString().Trim()),
                                                             new JProperty("ActivitiesImage", p.ActivitiesImage.ToString().Trim()),
                                                             new JProperty("FamilyName", p.FamilyName.ToString().Trim()),
                                                             new JProperty("FamilyID", p.FamilyID.ToString().Trim()),
                                                             new JProperty("FamilyNo", p.FamilyNo.ToString().Trim()),
                                                             new JProperty("FamilyBirthday", p.FamilyBirthday.ToString().Trim()),
                                                             new JProperty("FamilyGenderDesc", p.FamilyGenderDesc.ToString().Trim()),
                                                             new JProperty("FamilyGender", p.FamilyGender),
                                                             new JProperty("FamilyRelationshipDesc", p.FamilyRelationshipDesc.ToString().Trim()),
                                                             new JProperty("FamilyRelationship", p.FamilyRelationship),
                                                             new JProperty("IsSignup", p.IsSignup.ToString().Trim()),
                                                             new JProperty("ColumnName_1", p.ColumnName_1.ToString().Trim()),
                                                             new JProperty("ColumnType_1", p.ColumnType_1.ToString().Trim()),
                                                             new JProperty("ColumnItem_1", p.ColumnItem_1.ToString().Trim()),
                                                             new JProperty("ColumnAnswer_1", p.ColumnAnswer_1.ToString().Trim()),
                                                             new JProperty("ColumnName_2", p.ColumnName_2.ToString().Trim()),
                                                             new JProperty("ColumnType_2", p.ColumnType_2.ToString().Trim()),
                                                             new JProperty("ColumnItem_2", p.ColumnItem_2.ToString().Trim()),
                                                             new JProperty("ColumnAnswer_2", p.ColumnAnswer_2.ToString().Trim()),
                                                             new JProperty("ColumnName_3", p.ColumnName_3.ToString().Trim()),
                                                             new JProperty("ColumnType_3", p.ColumnType_3.ToString().Trim()),
                                                             new JProperty("ColumnItem_3", p.ColumnItem_3.ToString().Trim()),
                                                             new JProperty("ColumnAnswer_3", p.ColumnAnswer_3.ToString().Trim()),
                                                             new JProperty("ColumnName_4", p.ColumnName_4.ToString().Trim()),
                                                             new JProperty("ColumnType_4", p.ColumnType_4.ToString().Trim()),
                                                             new JProperty("ColumnItem_4", p.ColumnItem_4.ToString().Trim()),
                                                             new JProperty("ColumnAnswer_4", p.ColumnAnswer_4.ToString().Trim()),
                                                             new JProperty("ColumnName_5", p.ColumnName_5.ToString().Trim()),
                                                             new JProperty("ColumnType_5", p.ColumnType_5.ToString().Trim()),
                                                             new JProperty("ColumnItem_5", p.ColumnItem_5.ToString().Trim()),
                                                             new JProperty("ColumnAnswer_5", p.ColumnAnswer_5.ToString().Trim()),
                                                             new JProperty("ActivitiesRemarks", p.ActivitiesRemarks.ToString().Trim())
                                                  )
                                              )
                                          )
                                      ).ToString();
                        }

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 1 - 成功";
                    }
                    else
                    {
                        // 成功, 但無眷屬資料
                        strJson = new JObject(
                                      //new JProperty("ResultCode", "045916"),
                                      new JProperty("ResultCode", "1"),
                                      new JProperty("Content", "")
                                  ).ToString();

                        // 20180321 Hakkinen Add ResultCode
                        strResultCode = "ResultCode : 1 - 成功, 但無眷屬資料";
                    }
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                  new JProperty("ResultCode", "999001"),
                                  new JProperty("Content", "")
                              ).ToString();

                    // 20180321 Hakkinen Add ResultCode
                    strResultCode = "ResultCode : 999001 - 傳入參數不足或傳入參數格式錯誤";
                }
            }
            catch (Exception ex)
            {
                strJson = ex.Message.ToString();

                // 20180321 Hakkinen Add ResultCode
                strResultCode = "ResultCode : Exception - " + ex.Message.ToString();
            }

            // 20180321 Hakkinen Insert System Log Begin -----------------------------------------------
            SqlCommand cmdForSystemLog = new SqlCommand("usp_Activities_SystemLog", SQLConn);
            cmdForSystemLog.CommandType = CommandType.StoredProcedure;

            // Parameter Add
            cmdForSystemLog.Parameters.Add("@Log_AppName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_AppName"].Value = "Activitie";
            cmdForSystemLog.Parameters.Add("@Log_FunctionName", SqlDbType.NVarChar, 256);
            cmdForSystemLog.Parameters["@Log_FunctionName"].Value = "Activities_Signup_Family";
            cmdForSystemLog.Parameters.Add("@Log_Desc", SqlDbType.NVarChar, 3000);
            cmdForSystemLog.Parameters["@Log_Desc"].Value = strResultCode;
            cmdForSystemLog.ExecuteNonQuery();

            // 20180321 Hakkinen Insert System Log End -------------------------------------------------

            // 關閉連結 SQLConn
            SQLConn.Close();

            return strJson;
        }
    }

    // 活動清單列表
    public class ActivitiesInfo
    {
        // 活動編號
        private Int64 _ActivitiesID;
        public Int64 ActivitiesID
        {
            get
            {
                return _ActivitiesID;
            }
            set
            {
                _ActivitiesID = value;
            }
        }

        // 活動名稱
        private string _ActivitiesName;
        public string ActivitiesName
        {
            get
            {
                return _ActivitiesName;
            }
            set
            {
                _ActivitiesName = value;
            }
        }

        // 活動圖片路徑
        private string _ActivitiesImage;
        public string ActivitiesImage
        {
            get
            {
                return _ActivitiesImage;
            }
            set
            {
                _ActivitiesImage = value;
            }
        }

        // 活動報名日期
        private string _SignupDate;
        public string SignupDate
        {
            get
            {
                return _SignupDate;
            }
            set
            {
                _SignupDate = value;
            }
        }

        // 活動狀態
        private string _ActivitiesStatus;
        public string ActivitiesStatus
        {
            get
            {
                return _ActivitiesStatus;
            }
            set
            {
                _ActivitiesStatus = value;
            }
        }

        // 活動報名名額
        private Int64 _QuotaPlaces;
        public Int64 QuotaPlaces
        {
            get
            {
                return _QuotaPlaces;
            }
            set
            {
                _QuotaPlaces = value;
            }
        }

        // 活動剩餘名額
        private Int64 _RemainingPlaces;
        public Int64 RemainingPlaces
        {
            get
            {
                return _RemainingPlaces;
            }
            set
            {
                _RemainingPlaces = value;
            }
        }
        // 活動模式
        private int _SignupModel;
        public int SignupModel
        {
            get
            {
                return _SignupModel;
            }
            set
            {
                _SignupModel = value;
            }
        }
    }

    // 活動詳情內容
    public class ActivitiesDetailInfo
    {
        // 活動編號
        private Int64 _ActivitiesID;
        public Int64 ActivitiesID
        {
            get
            {
                return _ActivitiesID;
            }
            set
            {
                _ActivitiesID = value;
            }
        }

        // 活動名稱
        private string _ActivitiesName;
        public string ActivitiesName
        {
            get
            {
                return _ActivitiesName;
            }
            set
            {
                _ActivitiesName = value;
            }
        }

        // 活動圖片路徑
        private string _ActivitiesImage;
        public string ActivitiesImage
        {
            get
            {
                return _ActivitiesImage;
            }
            set
            {
                _ActivitiesImage = value;
            }
        }

        // 活動內容
        private string _ActivitiesContent;
        public string ActivitiesContent
        {
            get
            {
                return _ActivitiesContent;
            }
            set
            {
                _ActivitiesContent = value;
            }
        }

        // 活動模式
        private int _SignupModel;
        public int SignupModel
        {
            get
            {
                return _SignupModel;
            }
            set
            {
                _SignupModel = value;
            }
        }

        // 活動報名日期
        private string _SignupDate;
        public string SignupDate
        {
            get
            {
                return _SignupDate;
            }
            set
            {
                _SignupDate = value;
            }
        }

        // 活動截止日期
        private string _Deadline;
        public string Deadline
        {
            get
            {
                return _Deadline;
            }
            set
            {
                _Deadline = value;
            }
        }

        // 活動報名名額
        private Int64 _QuotaPlaces;
        public Int64 QuotaPlaces
        {
            get
            {
                return _QuotaPlaces;
            }
            set
            {
                _QuotaPlaces = value;
            }
        }

        // 活動已報名名額
        private Int64 _ActivitiesPlaces;
        public Int64 ActivitiesPlaces
        {
            get
            {
                return _ActivitiesPlaces;
            }
            set
            {
                _ActivitiesPlaces = value;
            }
        }

        // 活動限制名額
        private Int64 _LimitPlaces;
        public Int64 LimitPlaces
        {
            get
            {
                return _LimitPlaces;
            }
            set
            {
                _LimitPlaces = value;
            }
        }

        // 活動已報名額
        private Int64 _SignupPlaces;
        public Int64 SignupPlaces
        {
            get
            {
                return _SignupPlaces;
            }
            set
            {
                _SignupPlaces = value;
            }
        }

        // 是否報名
        private string _IsSignup;
        public string IsSignup
        {
            get
            {
                return _IsSignup;
            }
            set
            {
                _IsSignup = value;
            }
        }

        // 是否報名同類別活動
        private string _IsRepeatSignup;
        public string IsRepeatSignup
        {
            get
            {
                return _IsRepeatSignup;
            }
            set
            {
                _IsRepeatSignup = value;
            }
        }

        // 是否額滿
        private string _IsFull;
        public string IsFull
        {
            get
            {
                return _IsFull;
            }
            set
            {
                _IsFull = value;
            }
        }
    }

    // 家屬清單列表
    public class MyFamilyInfo
    {
        // 家屬編號
        private Int64 _FamilyNo;
        public Int64 FamilyNo
        {
            get
            {
                return _FamilyNo;
            }
            set
            {
                _FamilyNo = value;
            }
        }

        // 家屬身分證
        private string _FamilyID;
        public string FamilyID
        {
            get
            {
                return _FamilyID;
            }
            set
            {
                _FamilyID = value;
            }
        }

        // 家屬姓名
        private string _FamilyName;
        public string FamilyName
        {
            get
            {
                return _FamilyName;
            }
            set
            {
                _FamilyName = value;
            }
        }

        // 家屬性別編碼
        private Int64 _FamilyGender;
        public Int64 FamilyGender
        {
            get
            {
                return _FamilyGender;
            }
            set
            {
                _FamilyGender = value;
            }
        }

        // 家屬性別
        private string _GenderDesc;
        public string GenderDesc
        {
            get
            {
                return _GenderDesc;
            }
            set
            {
                _GenderDesc = value;
            }
        }

        // 家屬關係編碼
        private Int64 _FamilyRelationship;
        public Int64 FamilyRelationship
        {
            get
            {
                return _FamilyRelationship;
            }
            set
            {
                _FamilyRelationship = value;
            }
        }

        // 家屬關係
        private string _RelationshipDesc;
        public string RelationshipDesc
        {
            get
            {
                return _RelationshipDesc;
            }
            set
            {
                _RelationshipDesc = value;
            }
        }

        // 家屬生日
        private string _FamilyBirthday;
        public string FamilyBirthday
        {
            get
            {
                return _FamilyBirthday;
            }
            set
            {
                _FamilyBirthday = value;
            }
        }

        // 是否有活動報名
        private string _IsActivities;
        public string IsActivities
        {
            get
            {
                return _IsActivities;
            }
            set
            {
                _IsActivities = value;
            }
        }

        // 備註訊息
        private string _FamilyRemark;
        public string FamilyRemark
        {
            get
            {
                return _FamilyRemark;
            }
            set
            {
                _FamilyRemark = value;
            }
        }
    }

    // 已報名資訊
    public class ActivitiesRecordInfo
    {
        // 活動編號
        private Int64 _ActivitiesID;
        public Int64 ActivitiesID
        {
            get
            {
                return _ActivitiesID;
            }
            set
            {
                _ActivitiesID = value;
            }
        }

        // 活動名稱
        private string _ActivitiesName;
        public string ActivitiesName
        {
            get
            {
                return _ActivitiesName;
            }
            set
            {
                _ActivitiesName = value;
            }
        }

        // 報名編號
        private Int64 _SignupNo;
        public Int64 SignupNo
        {
            get
            {
                return _SignupNo;
            }
            set
            {
                _SignupNo = value;
            }
        }

        // 報名方式
        private string _SignupModel;
        public string SignupModel
        {
            get
            {
                return _SignupModel;
            }
            set
            {
                _SignupModel = value;
            }
        }

        // 員工工號
        private string _EmployeeNo;
        public string EmployeeNo
        {
            get
            {
                return _EmployeeNo;
            }
            set
            {
                _EmployeeNo = value;
            }
        }

        // 報名姓名
        private string _SignupName;
        public string SignupName
        {
            get
            {
                return _SignupName;
            }
            set
            {
                _SignupName = value;
            }
        }

        // 報名名額
        private Int64 _SignupPlaces;
        public Int64 SignupPlaces
        {
            get
            {
                return _SignupPlaces;
            }
            set
            {
                _SignupPlaces = value;
            }
        }

        // 報名關係
        private string _SignupRelationship;
        public string SignupRelationship
        {
            get
            {
                return _SignupRelationship;
            }
            set
            {
                _SignupRelationship = value;
            }
        }

        // 是否可取消
        private string _CanCancel;
        public string CanCancel
        {
            get
            {
                return _CanCancel;
            }
            set
            {
                _CanCancel = value;
            }
        }

        // 時段已報名時間
        private string _SignupTime;
        public string SignupTime
        {
            get
            {
                return _SignupTime;
            }
            set
            {
                _SignupTime = value;
            }
        }

        // 組隊已報名隊伍名稱
        private string _SignupTeamName;
        public string SignupTeamName
        {
            get
            {
                return _SignupTeamName;
            }
            set
            {
                _SignupTeamName = value;
            }
        }

        // 活動截止日期
        private string _Deadline;
        public string Deadline
        {
            get
            {
                return _Deadline;
            }
            set
            {
                _Deadline = value;
            }
        }
    }

    // 人員清單列表
    public class EmployeeInfo
    {
        // 員工部門
        private string _EmployeeDept;
        public string EmployeeDept
        {
            get
            {
                return _EmployeeDept;
            }
            set
            {
                _EmployeeDept = value;
            }
        }

        // 員工英文姓名
        private string _EmployeeName;
        public string EmployeeName
        {
            get
            {
                return _EmployeeName;
            }
            set
            {
                _EmployeeName = value;
            }
        }

        // 員工工號
        private string _EmployeeNo;
        public string EmployeeNo
        {
            get
            {
                return _EmployeeNo;
            }
            set
            {
                _EmployeeNo = value;
            }
        }
    }

    // 報名內容
    public class ActivitiesSignupInfo
    {
        // 活動編號
        private Int64 _ActivitiesID;
        public Int64 ActivitiesID
        {
            get
            {
                return _ActivitiesID;
            }
            set
            {
                _ActivitiesID = value;
            }
        }

        // 活動名稱
        private string _ActivitiesName;
        public string ActivitiesName
        {
            get
            {
                return _ActivitiesName;
            }
            set
            {
                _ActivitiesName = value;
            }
        }

        // 活動圖片路徑
        private string _ActivitiesImage;
        public string ActivitiesImage
        {
            get
            {
                return _ActivitiesImage;
            }
            set
            {
                _ActivitiesImage = value;
            }
        }

        // 活動報名名額
        private Int64 _QuotaPlaces;
        public Int64 QuotaPlaces
        {
            get
            {
                return _QuotaPlaces;
            }
            set
            {
                _QuotaPlaces = value;
            }
        }

        // 活動限制名額
        private int _LimitPlaces;
        public int LimitPlaces
        {
            get
            {
                return _LimitPlaces;
            }
            set
            {
                _LimitPlaces = value;
            }
        }

        // 活動已報名額
        private int _SignupPlaces;
        public int SignupPlaces
        {
            get
            {
                return _SignupPlaces;
            }
            set
            {
                _SignupPlaces = value;
            }
        }

        // 活動剩餘名額
        private int _RemainingPlaces;
        public int RemainingPlaces
        {
            get
            {
                return _RemainingPlaces;
            }
            set
            {
                _RemainingPlaces = value;
            }
        }


        // 員工姓名
        private string _EmployeeName;
        public string EmployeeName
        {
            get
            {
                return _EmployeeName;
            }
            set
            {
                _EmployeeName = value;
            }
        }

        // 員工身分證
        private string _EmpoyeeID;
        public string EmpoyeeID
        {
            get
            {
                return _EmpoyeeID;
            }
            set
            {
                _EmpoyeeID = value;
            }
        }

        // 員工生日
        private string _EmployeeBirthday;
        public string EmployeeBirthday
        {
            get
            {
                return _EmployeeBirthday;
            }
            set
            {
                _EmployeeBirthday = value;
            }
        }

        // 員工性別
        private string _EmployeeGender;
        public string EmployeeGender
        {
            get
            {
                return _EmployeeGender;
            }
            set
            {
                _EmployeeGender = value;
            }
        }

        // 員工關係
        private string _EmployeeRelationship;
        public string EmployeeRelationship
        {
            get
            {
                return _EmployeeRelationship;
            }
            set
            {
                _EmployeeRelationship = value;
            }
        }

        // 自定義欄位1名稱
        private string _ColumnName_1;
        public string ColumnName_1
        {
            get
            {
                return _ColumnName_1;
            }
            set
            {
                _ColumnName_1 = value;
            }
        }

        // 自定義欄位1類型
        private string _ColumnType_1;
        public string ColumnType_1
        {
            get
            {
                return _ColumnType_1;
            }
            set
            {
                _ColumnType_1 = value;
            }
        }

        // 自定義欄位1內容
        private string _ColumnItem_1;
        public string ColumnItem_1
        {
            get
            {
                return _ColumnItem_1;
            }
            set
            {
                _ColumnItem_1 = value;
            }
        }

        // 自定義欄位2名稱
        private string _ColumnName_2;
        public string ColumnName_2
        {
            get
            {
                return _ColumnName_2;
            }
            set
            {
                _ColumnName_2 = value;
            }
        }

        // 自定義欄位2類型
        private string _ColumnType_2;
        public string ColumnType_2
        {
            get
            {
                return _ColumnType_2;
            }
            set
            {
                _ColumnType_2 = value;
            }
        }
        // 自定義欄位2內容
        private string _ColumnItem_2;
        public string ColumnItem_2
        {
            get
            {
                return _ColumnItem_2;
            }
            set
            {
                _ColumnItem_2 = value;
            }
        }

        // 自定義欄位3名稱
        private string _ColumnName_3;
        public string ColumnName_3
        {
            get
            {
                return _ColumnName_3;
            }
            set
            {
                _ColumnName_3 = value;
            }
        }
        // 自定義欄位3類型
        private string _ColumnType_3;
        public string ColumnType_3
        {
            get
            {
                return _ColumnType_3;
            }
            set
            {
                _ColumnType_3 = value;
            }
        }
        // 自定義欄位3內容
        private string _ColumnItem_3;
        public string ColumnItem_3
        {
            get
            {
                return _ColumnItem_3;
            }
            set
            {
                _ColumnItem_3 = value;
            }
        }

        // 自定義欄位4名稱
        private string _ColumnName_4;
        public string ColumnName_4
        {
            get
            {
                return _ColumnName_4;
            }
            set
            {
                _ColumnName_4 = value;
            }
        }
        // 自定義欄位4類型
        private string _ColumnType_4;
        public string ColumnType_4
        {
            get
            {
                return _ColumnType_4;
            }
            set
            {
                _ColumnType_4 = value;
            }
        }
        // 自定義欄位4內容
        private string _ColumnItem_4;
        public string ColumnItem_4
        {
            get
            {
                return _ColumnItem_4;
            }
            set
            {
                _ColumnItem_4 = value;
            }
        }

        // 自定義欄位5名稱
        private string _ColumnName_5;
        public string ColumnName_5
        {
            get
            {
                return _ColumnName_5;
            }
            set
            {
                _ColumnName_5 = value;
            }
        }
        // 自定義欄位5類型
        private string _ColumnType_5;
        public string ColumnType_5
        {
            get
            {
                return _ColumnType_5;
            }
            set
            {
                _ColumnType_5 = value;
            }
        }
        // 自定義欄位5內容
        private string _ColumnItem_5;
        public string ColumnItem_5
        {
            get
            {
                return _ColumnItem_5;
            }
            set
            {
                _ColumnItem_5 = value;
            }
        }

        // 時段編號
        private Int64 _TimeID;
        public Int64 TimeID
        {
            get
            {
                return _TimeID;
            }
            set
            {
                _TimeID = value;
            }
        }

        // 時段排序
        private int _TimeSort;
        public int TimeSort
        {
            get
            {
                return _TimeSort;
            }
            set
            {
                _TimeSort = value;
            }
        }

        // 報名時段
        private string _SignupTime;
        public string SignupTime
        {
            get
            {
                return _SignupTime;
            }
            set
            {
                _SignupTime = value;
            }
        }

        // 活動備註
        private string _ActivitiesRemarks;
        public string ActivitiesRemarks
        {
            get
            {
                return _ActivitiesRemarks;
            }
            set
            {
                _ActivitiesRemarks = value;
            }
        }

        // 是否報名其他場次
        private string _IsRepeatSignup;
        public string IsRepeatSignup
        {
            get
            {
                return _IsRepeatSignup;
            }
            set
            {
                _IsRepeatSignup = value;
            }
        }
    }

    // 報名管理
    public class ActivitiesSignupManageInfo
    {
        // 活動編號
        private Int64 _ActivitiesID;
        public Int64 ActivitiesID
        {
            get
            {
                return _ActivitiesID;
            }
            set
            {
                _ActivitiesID = value;
            }
        }

        // 活動名稱
        private string _ActivitiesName;
        public string ActivitiesName
        {
            get
            {
                return _ActivitiesName;
            }
            set
            {
                _ActivitiesName = value;
            }
        }

        // 活動圖片路徑
        private string _ActivitiesImage;
        public string ActivitiesImage
        {
            get
            {
                return _ActivitiesImage;
            }
            set
            {
                _ActivitiesImage = value;
            }
        }

        // 活動報名名額
        private Int64 _QuotaPlaces;
        public Int64 QuotaPlaces
        {
            get
            {
                return _QuotaPlaces;
            }
            set
            {
                _QuotaPlaces = value;
            }
        }

        // 活動限制名額
        private int _LimitPlaces;
        public int LimitPlaces
        {
            get
            {
                return _LimitPlaces;
            }
            set
            {
                _LimitPlaces = value;
            }
        }

        // 活動已報名額
        private int _SignupPlaces;
        public int SignupPlaces
        {
            get
            {
                return _SignupPlaces;
            }
            set
            {
                _SignupPlaces = value;
            }
        }

        // 活動剩餘名額
        private int _RemainingPlaces;
        public int RemainingPlaces
        {
            get
            {
                return _RemainingPlaces;
            }
            set
            {
                _RemainingPlaces = value;
            }
        }

        // 員工姓名
        private string _EmployeeName;
        public string EmployeeName
        {
            get
            {
                return _EmployeeName;
            }
            set
            {
                _EmployeeName = value;
            }
        }

        // 員工身分證
        private string _EmpoyeeID;
        public string EmpoyeeID
        {
            get
            {
                return _EmpoyeeID;
            }
            set
            {
                _EmpoyeeID = value;
            }
        }

        // 員工生日
        private string _EmployeeBirthday;
        public string EmployeeBirthday
        {
            get
            {
                return _EmployeeBirthday;
            }
            set
            {
                _EmployeeBirthday = value;
            }
        }

        // 員工性別
        private string _EmployeeGender;
        public string EmployeeGender
        {
            get
            {
                return _EmployeeGender;
            }
            set
            {
                _EmployeeGender = value;
            }
        }

        // 員工關係
        private string _EmployeeRelationship;
        public string EmployeeRelationship
        {
            get
            {
                return _EmployeeRelationship;
            }
            set
            {
                _EmployeeRelationship = value;
            }
        }

        // 自定義欄位1名稱
        private string _ColumnName_1;
        public string ColumnName_1
        {
            get
            {
                return _ColumnName_1;
            }
            set
            {
                _ColumnName_1 = value;
            }
        }

        // 自定義欄位1類型
        private string _ColumnType_1;
        public string ColumnType_1
        {
            get
            {
                return _ColumnType_1;
            }
            set
            {
                _ColumnType_1 = value;
            }
        }

        // 自定義欄位1內容
        private string _ColumnItem_1;
        public string ColumnItem_1
        {
            get
            {
                return _ColumnItem_1;
            }
            set
            {
                _ColumnItem_1 = value;
            }
        }

        // 自定義欄位1回答
        private string _ColumnAnswer_1;
        public string ColumnAnswer_1
        {
            get
            {
                return _ColumnAnswer_1;
            }
            set
            {
                _ColumnAnswer_1 = value;
            }
        }

        // 自定義欄位2名稱
        private string _ColumnName_2;
        public string ColumnName_2
        {
            get
            {
                return _ColumnName_2;
            }
            set
            {
                _ColumnName_2 = value;
            }
        }

        // 自定義欄位2類型
        private string _ColumnType_2;
        public string ColumnType_2
        {
            get
            {
                return _ColumnType_2;
            }
            set
            {
                _ColumnType_2 = value;
            }
        }

        // 自定義欄位2內容
        private string _ColumnItem_2;
        public string ColumnItem_2
        {
            get
            {
                return _ColumnItem_2;
            }
            set
            {
                _ColumnItem_2 = value;
            }
        }

        // 自定義欄位2回答
        private string _ColumnAnswer_2;
        public string ColumnAnswer_2
        {
            get
            {
                return _ColumnAnswer_2;
            }
            set
            {
                _ColumnAnswer_2 = value;
            }
        }

        // 自定義欄位3名稱
        private string _ColumnName_3;
        public string ColumnName_3
        {
            get
            {
                return _ColumnName_3;
            }
            set
            {
                _ColumnName_3 = value;
            }
        }

        // 自定義欄位3類型
        private string _ColumnType_3;
        public string ColumnType_3
        {
            get
            {
                return _ColumnType_3;
            }
            set
            {
                _ColumnType_3 = value;
            }
        }

        // 自定義欄位3內容
        private string _ColumnItem_3;
        public string ColumnItem_3
        {
            get
            {
                return _ColumnItem_3;
            }
            set
            {
                _ColumnItem_3 = value;
            }
        }

        // 自定義欄位3回答
        private string _ColumnAnswer_3;
        public string ColumnAnswer_3
        {
            get
            {
                return _ColumnAnswer_3;
            }
            set
            {
                _ColumnAnswer_3 = value;
            }
        }

        // 自定義欄位4名稱
        private string _ColumnName_4;
        public string ColumnName_4
        {
            get
            {
                return _ColumnName_4;
            }
            set
            {
                _ColumnName_4 = value;
            }
        }

        // 自定義欄位4類型
        private string _ColumnType_4;
        public string ColumnType_4
        {
            get
            {
                return _ColumnType_4;
            }
            set
            {
                _ColumnType_4 = value;
            }
        }

        // 自定義欄位4內容
        private string _ColumnItem_4;
        public string ColumnItem_4
        {
            get
            {
                return _ColumnItem_4;
            }
            set
            {
                _ColumnItem_4 = value;
            }
        }

        // 自定義欄位4回答
        private string _ColumnAnswer_4;
        public string ColumnAnswer_4
        {
            get
            {
                return _ColumnAnswer_4;
            }
            set
            {
                _ColumnAnswer_4 = value;
            }
        }

        // 自定義欄位5名稱
        private string _ColumnName_5;
        public string ColumnName_5
        {
            get
            {
                return _ColumnName_5;
            }
            set
            {
                _ColumnName_5 = value;
            }
        }

        // 自定義欄位5類型
        private string _ColumnType_5;
        public string ColumnType_5
        {
            get
            {
                return _ColumnType_5;
            }
            set
            {
                _ColumnType_5 = value;
            }
        }

        // 自定義欄位5內容
        private string _ColumnItem_5;
        public string ColumnItem_5
        {
            get
            {
                return _ColumnItem_5;
            }
            set
            {
                _ColumnItem_5 = value;
            }
        }

        // 自定義欄位5回答
        private string _ColumnAnswer_5;
        public string ColumnAnswer_5
        {
            get
            {
                return _ColumnAnswer_5;
            }
            set
            {
                _ColumnAnswer_5 = value;
            }
        }

        // 時段編號
        private Int64 _TimeID;
        public Int64 TimeID
        {
            get
            {
                return _TimeID;
            }
            set
            {
                _TimeID = value;
            }
        }

        // 時段排序
        private int _TimeSort;
        public int TimeSort
        {
            get
            {
                return _TimeSort;
            }
            set
            {
                _TimeSort = value;
            }
        }

        // 報名時段
        private string _SignupTime;
        public string SignupTime
        {
            get
            {
                return _SignupTime;
            }
            set
            {
                _SignupTime = value;
            }
        }

        // 已報名時段
        private string _IsSignupTime;
        public string IsSignupTime
        {
            get
            {
                return _IsSignupTime;
            }
            set
            {
                _IsSignupTime = value;
            }
        }

        // 活動備註
        private string _ActivitiesRemarks;
        public string ActivitiesRemarks
        {
            get
            {
                return _ActivitiesRemarks;
            }
            set
            {
                _ActivitiesRemarks = value;
            }
        }

        // 是否報名其他場次
        private string _IsRepeatSignup;
        public string IsRepeatSignup
        {
            get
            {
                return _IsRepeatSignup;
            }
            set
            {
                _IsRepeatSignup = value;
            }
        }

        // 是否額滿
        private string _IsFull;
        public string IsFull
        {
            get
            {
                return _IsFull;
            }
            set
            {
                _IsFull = value;
            }
        }

        // 報名隊伍數
        private int _SignupTeam;
        public int SignupTeam
        {
            get
            {
                return _SignupTeam;
            }
            set
            {
                _SignupTeam = value;
            }
        }

        // 隊伍排序號
        private int _TeamNo;
        public int TeamNo
        {
            get
            {
                return _TeamNo;
            }
            set
            {
                _TeamNo = value;
            }
        }

        // 隊伍編號
        private string _TeamID;
        public string TeamID
        {
            get
            {
                return _TeamID;
            }
            set
            {
                _TeamID = value;
            }
        }

        // 隊伍名稱
        private string _TeamName;
        public string TeamName
        {
            get
            {
                return _TeamName;
            }
            set
            {
                _TeamName = value;
            }
        }

        // 隊伍部門碼
        private string _TeamDept;
        public string TeamDept
        {
            get
            {
                return _TeamDept;
            }
            set
            {
                _TeamDept = value;
            }
        }

        // 隊伍成員
        private string _TeamMember;
        public string TeamMember
        {
            get
            {
                return _TeamMember;
            }
            set
            {
                _TeamMember = value;
            }
        }

        // 隊伍成員部門碼
        private string _TeamMemberDept;
        public string TeamMemberDept
        {
            get
            {
                return _TeamMemberDept;
            }
            set
            {
                _TeamMemberDept = value;
            }
        }

        // 隊伍成員部門碼
        private string _SignupNo;
        public string SignupNo
        {
            get
            {
                return _SignupNo;
            }
            set
            {
                _SignupNo = value;
            }
        }


    }

    // 眷屬報名
    public class ActivitiesSignupFamilyInfo
    {
        // 活動編號
        private Int64 _ActivitiesID;
        public Int64 ActivitiesID
        {
            get
            {
                return _ActivitiesID;
            }
            set
            {
                _ActivitiesID = value;
            }
        }

        // 活動名稱
        private string _ActivitiesName;
        public string ActivitiesName
        {
            get
            {
                return _ActivitiesName;
            }
            set
            {
                _ActivitiesName = value;
            }
        }

        // 活動圖片路徑
        private string _ActivitiesImage;
        public string ActivitiesImage
        {
            get
            {
                return _ActivitiesImage;
            }
            set
            {
                _ActivitiesImage = value;
            }
        }

        // 眷屬姓名
        private string _FamilyName;
        public string FamilyName
        {
            get
            {
                return _FamilyName;
            }
            set
            {
                _FamilyName = value;
            }
        }

        // 眷屬身分證
        private string _FamilyID;
        public string FamilyID
        {
            get
            {
                return _FamilyID;
            }
            set
            {
                _FamilyID = value;
            }
        }

        // 眷屬編號
        private string _FamilyNo;
        public string FamilyNo
        {
            get
            {
                return _FamilyNo;
            }
            set
            {
                _FamilyNo = value;
            }
        }

        // 眷屬生日
        private string _FamilyBirthday;
        public string FamilyBirthday
        {
            get
            {
                return _FamilyBirthday;
            }
            set
            {
                _FamilyBirthday = value;
            }
        }

        // 眷屬性別
        private int _FamilyGender;
        public int FamilyGender
        {
            get
            {
                return _FamilyGender;
            }
            set
            {
                _FamilyGender = value;
            }
        }

        // 眷屬性別描述
        private string _FamilyGenderDesc;
        public string FamilyGenderDesc
        {
            get
            {
                return _FamilyGenderDesc;
            }
            set
            {
                _FamilyGenderDesc = value;
            }
        }

        // 眷屬關係
        private int _FamilyRelationship;
        public int FamilyRelationship
        {
            get
            {
                return _FamilyRelationship;
            }
            set
            {
                _FamilyRelationship = value;
            }
        }

        // 眷屬關係描述
        private string _FamilyRelationshipDesc;
        public string FamilyRelationshipDesc
        {
            get
            {
                return _FamilyRelationshipDesc;
            }
            set
            {
                _FamilyRelationshipDesc = value;
            }
        }

        // 自定義欄位1名稱
        private string _ColumnName_1;
        public string ColumnName_1
        {
            get
            {
                return _ColumnName_1;
            }
            set
            {
                _ColumnName_1 = value;
            }
        }

        // 自定義欄位1類型
        private string _ColumnType_1;
        public string ColumnType_1
        {
            get
            {
                return _ColumnType_1;
            }
            set
            {
                _ColumnType_1 = value;
            }
        }

        // 自定義欄位1內容
        private string _ColumnItem_1;
        public string ColumnItem_1
        {
            get
            {
                return _ColumnItem_1;
            }
            set
            {
                _ColumnItem_1 = value;
            }
        }

        // 自定義欄位1回答
        private string _ColumnAnswer_1;
        public string ColumnAnswer_1
        {
            get
            {
                return _ColumnAnswer_1;
            }
            set
            {
                _ColumnAnswer_1 = value;
            }
        }

        // 自定義欄位2名稱
        private string _ColumnName_2;
        public string ColumnName_2
        {
            get
            {
                return _ColumnName_2;
            }
            set
            {
                _ColumnName_2 = value;
            }
        }

        // 自定義欄位2類型
        private string _ColumnType_2;
        public string ColumnType_2
        {
            get
            {
                return _ColumnType_2;
            }
            set
            {
                _ColumnType_2 = value;
            }
        }

        // 自定義欄位2內容
        private string _ColumnItem_2;
        public string ColumnItem_2
        {
            get
            {
                return _ColumnItem_2;
            }
            set
            {
                _ColumnItem_2 = value;
            }
        }

        // 自定義欄位2回答
        private string _ColumnAnswer_2;
        public string ColumnAnswer_2
        {
            get
            {
                return _ColumnAnswer_2;
            }
            set
            {
                _ColumnAnswer_2 = value;
            }
        }

        // 自定義欄位3名稱
        private string _ColumnName_3;
        public string ColumnName_3
        {
            get
            {
                return _ColumnName_3;
            }
            set
            {
                _ColumnName_3 = value;
            }
        }

        // 自定義欄位3類型
        private string _ColumnType_3;
        public string ColumnType_3
        {
            get
            {
                return _ColumnType_3;
            }
            set
            {
                _ColumnType_3 = value;
            }
        }

        // 自定義欄位3內容
        private string _ColumnItem_3;
        public string ColumnItem_3
        {
            get
            {
                return _ColumnItem_3;
            }
            set
            {
                _ColumnItem_3 = value;
            }
        }

        // 自定義欄位3回答
        private string _ColumnAnswer_3;
        public string ColumnAnswer_3
        {
            get
            {
                return _ColumnAnswer_3;
            }
            set
            {
                _ColumnAnswer_3 = value;
            }
        }

        // 自定義欄位4名稱
        private string _ColumnName_4;
        public string ColumnName_4
        {
            get
            {
                return _ColumnName_4;
            }
            set
            {
                _ColumnName_4 = value;
            }
        }

        // 自定義欄位4類型
        private string _ColumnType_4;
        public string ColumnType_4
        {
            get
            {
                return _ColumnType_4;
            }
            set
            {
                _ColumnType_4 = value;
            }
        }

        // 自定義欄位4內容
        private string _ColumnItem_4;
        public string ColumnItem_4
        {
            get
            {
                return _ColumnItem_4;
            }
            set
            {
                _ColumnItem_4 = value;
            }
        }

        // 自定義欄位4回答
        private string _ColumnAnswer_4;
        public string ColumnAnswer_4
        {
            get
            {
                return _ColumnAnswer_4;
            }
            set
            {
                _ColumnAnswer_4 = value;
            }
        }

        // 自定義欄位5名稱
        private string _ColumnName_5;
        public string ColumnName_5
        {
            get
            {
                return _ColumnName_5;
            }
            set
            {
                _ColumnName_5 = value;
            }
        }

        // 自定義欄位5類型
        private string _ColumnType_5;
        public string ColumnType_5
        {
            get
            {
                return _ColumnType_5;
            }
            set
            {
                _ColumnType_5 = value;
            }
        }

        // 自定義欄位5內容
        private string _ColumnItem_5;
        public string ColumnItem_5
        {
            get
            {
                return _ColumnItem_5;
            }
            set
            {
                _ColumnItem_5 = value;
            }
        }

        // 自定義欄位5回答
        private string _ColumnAnswer_5;
        public string ColumnAnswer_5
        {
            get
            {
                return _ColumnAnswer_5;
            }
            set
            {
                _ColumnAnswer_5 = value;
            }
        }

        // 活動備註
        private string _ActivitiesRemarks;
        public string ActivitiesRemarks
        {
            get
            {
                return _ActivitiesRemarks;
            }
            set
            {
                _ActivitiesRemarks = value;
            }
        }


        // 是否額滿
        private string _IsSignup;
        public string IsSignup
        {
            get
            {
                return _IsSignup;
            }
            set
            {
                _IsSignup = value;
            }
        }



    }
}
