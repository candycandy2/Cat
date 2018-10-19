﻿using Newtonsoft.Json.Linq;
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

namespace PortalWebService
{
    /// <summary>
    /// PortalForQPlayAPI 的摘要说明
    /// 20171003
    /// Hakkinen Coding
    /// </summary>
    
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]

    [System.Web.Script.Services.ScriptService]
    public class PortalForQPlayAPI : System.Web.Services.WebService
    {
        // 公告清單
        [WebMethod]
        public string PortalList(string strXml)
        {
            string strJson = "";
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                    <LayoutHeader><PortalCategory>ITS</PortalCategory></LayoutHeader>
				*/
                #endregion

                // 設定傳入參數
                string PortalCategory = xmlDoc.SelectSingleNode("//PortalCategory").InnerText; // 公告類別

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(PortalCategory))
                {
                    // 回傳參數陣列宣告
                    List<PortalList> PortalListInfo = new List<PortalList>();

                    string strSQL = string.Empty;

                    // 判斷公告類別
                    switch (PortalCategory)
                    {
                        case "Announcement":
                            strSQL = " Select * From myBenQ_Talk_Announcement_View with(nolock) ";
                            break;
                        case "Communication":
                            strSQL = " Select * From myBenQ_Talk_Communication_View with(nolock) ";
                            break;
                        case "CIP":
                            strSQL = " Select * From myBenQ_Talk_CIP_View with(nolock) ";
                            break;
                        case "CSD":
                            strSQL = " Select * From myBenQ_Talk_CSD_View with(nolock) ";
                            break;
                        case "ITS":
                            strSQL = " Select * From myBenQ_Talk_ITS_View with(nolock) ";
                            break;
                        case "IDEA":
                            strSQL = " Select * From myBenQ_Talk_IDEA_View with(nolock) ";
                            break;
                        default:
                            break;

                    }

                    // Begin 以下為 SQL 執行程式碼
                    string strConnString = ConfigurationManager.AppSettings["MyQisda.DataAccess.ConnectionString"];
                    SqlConnection SQLConn = new SqlConnection(strConnString);

                    // 開啟 SQLConn
                    SQLConn.Open();

                    // 設定執行參數
                    DataTable DataTablePortalListInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand(strSQL, SQLConn);
                    cmd.CommandType = CommandType.Text;

                    // 設定Table取值
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTablePortalListInfo);
                    // End 將執行後的資料存到 DataTablePortalListinfo

                    // 關閉連結 SQLConn
                    SQLConn.Close();

                    // 判斷我的預約是否有值
                    if (DataTablePortalListInfo != null && DataTablePortalListInfo.Rows.Count > 0)
                    {
                        for (int i = 0; i < DataTablePortalListInfo.Rows.Count; i++)
                        {
                            PortalList TempPortalList = new PortalList();
                            TempPortalList.PortalID = (int)DataTablePortalListInfo.Rows[i]["PortalID"];
                            TempPortalList.PortalSubject = DataTablePortalListInfo.Rows[i]["PortalSubject"].ToString().Trim();
                            TempPortalList.PortalDate = DataTablePortalListInfo.Rows[i]["PortalDate"].ToString().Trim();
                            // 20171018 Hakkinen 外網網址取代內網網址
                            TempPortalList.PortalURL = DataTablePortalListInfo.Rows[i]["PortalURL"].ToString().ToString().Replace("myqisda.qgroup.corp.com", "www.myqisda.com").Replace("QTYPortalSrv.qgroup.corp.com", "www.myqisda.com").Trim();
                            TempPortalList.PortalImageURL = DataTablePortalListInfo.Rows[i]["PortalImageURL"].ToString().ToString().Replace("myqisda.qgroup.corp.com", "www.myqisda.com").Replace("QTYPortalSrv.qgroup.corp.com", "www.myqisda.com").Trim();
                            PortalListInfo.Add(TempPortalList);
                        }

                        // 將資料存入 Json 格式
                        strJson = new JObject(
                                    new JProperty("ResultCode", "1"),
                                    new JProperty("Content",
                                            new JArray(
                            //使用LINQ to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                                    from p in PortalListInfo
                                                    select new JObject(
                                                           new JProperty("PortalID", p.PortalID),
                                                           new JProperty("PortalSubject", p.PortalSubject),
                                                           new JProperty("PortalDate", p.PortalDate),
                                                           new JProperty("PortalURL", p.PortalURL),
                                                           new JProperty("PortalImageURL", p.PortalImageURL)
                                                           )
                                                      )
                                            )
                                     ).ToString();
                    }
                    else
                    {
                        // 查無資料
                        strJson = new JObject(
                                    new JProperty("ResultCode", "044901"),
                                    new JProperty("Content", "")
                                    ).ToString();
                    }
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                    new JProperty("ResultCode", "999001"),
                                    new JProperty("Content", "")
                                    ).ToString();
                }
            }
            catch (Exception ex)
            {
                strJson = ex.Message.ToString();
            }
            return strJson;
        }

        // 公告內容
        [WebMethod]
        public string PortalListDetail(string strXml)
        {
            string strJson = "";
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                    <LayoutHeader><PortalID>121793</PortalID></LayoutHeader>
        		*/
                #endregion

                // 設定傳入參數
                string PortalID = xmlDoc.SelectSingleNode("//PortalID").InnerText;

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(PortalID))
                {
                    List<PortalListDetail> PortalListDetailInfo = new List<PortalListDetail>();

                    string strSQL = string.Empty;

                    // 公告內容 SQL Script
                    strSQL = " Select Content As 'PortalContent' From myBenQ_Talk with(nolock) Where 1=1 And TID = @PortalID ";

                    // Begin 以下為SQL執行程式碼
                    string strConnString = ConfigurationManager.AppSettings["MyQisda.DataAccess.ConnectionString"];
                    SqlConnection SQLConn = new SqlConnection(strConnString);

                    // 開啟 SQLConn
                    SQLConn.Open();

                    // 設定執行參數
                    DataTable DataTablePortalListDetailInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand(strSQL, SQLConn);
                    cmd.CommandType = CommandType.Text;

                    // Parameter 設定
                    cmd.Parameters.Add("@PortalID", SqlDbType.NVarChar, 10);
                    cmd.Parameters["@PortalID"].Value = PortalID;

                    // 設定Table取值
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTablePortalListDetailInfo);
                    // End 將執行後的資料存到 DataTableMyReserveInfo

                    // 關閉連結 SQLConn
                    SQLConn.Close();

                    // 判斷當日預約明細是否有值
                    if (DataTablePortalListDetailInfo != null && DataTablePortalListDetailInfo.Rows.Count > 0)
                    {
                        for (int i = 0; i < DataTablePortalListDetailInfo.Rows.Count; i++)
                        {
                            PortalListDetail TempPortalListDetail = new PortalListDetail();
                            // 20171018 Hakkinen 外網網址取代內網網址
                            TempPortalListDetail.PortalContent = DataTablePortalListDetailInfo.Rows[i]["PortalContent"].ToString().Replace("myqisda.qgroup.corp.com", "www.myqisda.com").Replace("QTYPortalSrv.qgroup.corp.com", "www.myqisda.com").Trim();                        
                                                          
                            PortalListDetailInfo.Add(TempPortalListDetail);
                        }


                        // 將資料存入 Json 格式
                        strJson = new JObject(
                                       new JProperty("ResultCode", "1"),
                                       new JProperty("Content",
                                                new JArray(
                            //使用 LINQ to JSON 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                                        from p in PortalListDetailInfo
                                                        select new JObject(
                                                               new JProperty("PortalContent", p.PortalContent)
                                                               )
                                                      )
                                                )
                                       ).ToString();
                    }
                    else
                    {
                        // 查無資料
                        strJson = new JObject(
                                    new JProperty("ResultCode", "044901"),
                                    new JProperty("Content", "")
                                    ).ToString();
                    }
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                    new JProperty("ResultCode", "999001"),
                                    new JProperty("Content", "")
                                        ).ToString();
                }
            }
            catch (Exception ex)
            {
                strJson = ex.Message.ToString();
            }
            return strJson;
        }

        // 特約商店清單
        [WebMethod]
        public string StoreList(string strXml)
        {
            string strJson = "";
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(strXml);
                #region 輸入參數說明
                /*
                    <LayoutHeader><Category>食</Category><UpdateDate>201712-31 00:00:00.000</UpdateDate></LayoutHeader> 
        		*/
                #endregion

                // 設定傳入參數
                string Category = xmlDoc.SelectSingleNode("//Category").InnerText;
                string UpdateDate = xmlDoc.SelectSingleNode("//UpdateDate").InnerText;
                DateTime CurrentDate = DateTime.Today;
                string CurrentDateStr = CurrentDate.ToString("yyyy-MM-dd");

                if (UpdateDate == null)
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                    new JProperty("ResultCode", "999001"),
                                    new JProperty("Content", "")
                                        ).ToString();
                }
                else
                {
                    // 回傳參數陣列宣告
                    List<StoreList> StoreListInfo = new List<StoreList>();
                    string strSQL = string.Empty;
                    if (!string.IsNullOrEmpty(Category))
                    {
                        if (!string.IsNullOrEmpty(UpdateDate) || UpdateDate != null)
                        {
                            // 特約商店內容 SQL Script
                            strSQL = " Select * From Merchant_List with(nolock) Where 1=1 And '" + CurrentDateStr + "' BETWEEN Date1 AND Date2 And UpdateDate > @UpdateDate And Category = @Category";
                        }
                    }
                    else if (string.IsNullOrEmpty(Category) && UpdateDate != null)
                    {
                        // 特約商店內容 SQL Script
                        strSQL = " Select * From Merchant_List with(nolock) Where 1=1 And '" + CurrentDateStr + "' BETWEEN Date1 AND Date2 And UpdateDate > @UpdateDate";
                    }
                    // Begin 以下為SQL執行程式碼
                    string strConnString = ConfigurationManager.AppSettings["MyQisda.DataAccess.ConnectionString"];
                    SqlConnection SQLConn = new SqlConnection(strConnString);

                    // 開啟 SQLConn
                    SQLConn.Open();

                    // 設定執行參數
                    DataTable DataTableStoreListInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand(strSQL, SQLConn);
                    cmd.CommandType = CommandType.Text;

                    // Parameter 設定
                    cmd.Parameters.Add("@Category", SqlDbType.NVarChar, 1);
                    cmd.Parameters["@Category"].Value = Category;
                    cmd.Parameters.Add("@UpdateDate", SqlDbType.NVarChar, 10);
                    cmd.Parameters["@UpdateDate"].Value = UpdateDate;

                    // 設定Table取值
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTableStoreListInfo);
                    // End 將執行後的資料存到 DataTableStoreListDetailInfo

                    // 關閉連結 SQLConn
                    SQLConn.Close();

                    // 判斷特約商店是否有值
                    if (DataTableStoreListInfo != null && DataTableStoreListInfo.Rows.Count > 0)
                    {
                        for (int i = 0; i < DataTableStoreListInfo.Rows.Count; i++)
                        {
                            StoreList TempStoreList = new StoreList();
                            List<string> ImagesList = new List<string>();
                            TempStoreList.StoreID = (int)DataTableStoreListInfo.Rows[i]["MIndex"];
                            TempStoreList.Category = DataTableStoreListInfo.Rows[i]["Category"].ToString().Trim();
                            TempStoreList.County = DataTableStoreListInfo.Rows[i]["County"].ToString().Trim();
                            TempStoreList.Township = DataTableStoreListInfo.Rows[i]["Township"].ToString().Trim();
                            TempStoreList.Subject = DataTableStoreListInfo.Rows[i]["Subject"].ToString().Trim();
                            TempStoreList.Address = DataTableStoreListInfo.Rows[i]["Address"].ToString().Trim();
                            TempStoreList.Position = DataTableStoreListInfo.Rows[i]["Position"].ToString().Trim();
                            TempStoreList.ContactPerson = DataTableStoreListInfo.Rows[i]["ContactPerson"].ToString().Trim();
                            TempStoreList.Email = DataTableStoreListInfo.Rows[i]["Email"].ToString().Trim();
                            TempStoreList.Phone = DataTableStoreListInfo.Rows[i]["PhoneNumber"].ToString().Trim();
                            TempStoreList.Date1 = DataTableStoreListInfo.Rows[i]["Date1"].ToString().Trim();
                            TempStoreList.Date2 = DataTableStoreListInfo.Rows[i]["Date2"].ToString().Trim();
                            TempStoreList.Summary = DataTableStoreListInfo.Rows[i]["Summary"].ToString().Trim();
                            for (int j = 1; j <= 10; j++)
                            {
                                string imageURL;
                                if (DataTableStoreListInfo.Rows[i]["Image" + (j.ToString())].ToString().Length != 0)
                                {
                                    imageURL = "www.myqisda.com/services/merchant/file/" + DataTableStoreListInfo.Rows[i]["Image" + (j.ToString())].ToString();
                                }
                                else
                                {
                                    imageURL = DataTableStoreListInfo.Rows[i]["Image" + (j.ToString())].ToString();
                                }
                                //_ImagesArray.SetValue(imageURL, j-1);
                                //TempStoreList.ImagesArray = string.Join(", ", imageURL);
                                ImagesList.Add(imageURL);
                            }

                            TempStoreList.Images = ImagesList.ToArray();
                            TempStoreList.UpdateDate = DataTableStoreListInfo.Rows[i]["UpdateDate"].ToString().Trim();
                            StoreListInfo.Add(TempStoreList);
                            // 將資料存入 Json 格式
                            strJson = new JObject(
                                        new JProperty("ResultCode", "1"),
                                        new JProperty("Content",
                                                new JArray(
                                                        //使用LINQ to Json 可直接在 Select 語句中生成 Json 資料，無須其他轉換過程
                                                        from p in StoreListInfo
                                                        select new JObject(
                                                               new JProperty("MIndex", p.StoreID),
                                                               new JProperty("Category", p.Category),
                                                               new JProperty("County", p.County),
                                                               new JProperty("Township", p.Township),
                                                               new JProperty("Subject", p.Subject),
                                                               new JProperty("Address", p.Address),
                                                               new JProperty("Position", p.Position),
                                                               new JProperty("ContactPerson", p.ContactPerson),
                                                               new JProperty("Email", p.Email),
                                                               new JProperty("Phone", p.Phone),
                                                               new JProperty("Date1", p.Date1),
                                                               new JProperty("Date2", p.Date2),
                                                               new JProperty("Summary", p.Summary),
                                                               new JProperty("Images", p.Images),
                                                               new JProperty("UpdateDate", p.UpdateDate)
                                                               )
                                                          )
                                                )
                                         ).ToString();
                        }
                    }
                    else
                    {
                        // 查無資料
                        strJson = new JObject(
                                    new JProperty("ResultCode", "044901"),
                                    new JProperty("Content", "")
                                    ).ToString();
                    }
                }

            }
            catch (Exception ex)
            {
                strJson = ex.Message.ToString();
            }
            return strJson;
        }
    }

    // 公告清單
    public class PortalList
    {
        // 公告序號
        private int _PortalID;
        public int PortalID
        {
            get
            {
                return _PortalID;
            }
            set
            {
                _PortalID = value;
            }
        }

        // 公告標題
        private string _PortalSubject;
        public string PortalSubject
        {
            get
            {
                return _PortalSubject;
            }
            set
            {
                _PortalSubject = value;
            }
        }

        // 公告日期
        private string _PortalDate;
        public string PortalDate
        {
            get
            {
                return _PortalDate;
            }
            set
            {
                _PortalDate = value;
            }
        }

        // 公告連結
        private string _PortalURL;
        public string PortalURL
        {
            get
            {
                return _PortalURL;
            }
            set
            {
                _PortalURL = value;
            }
        }

        // 公告圖片連結 Add by Jennifer
        private string _PortalImageURL;
        public string PortalImageURL
        {
            get
            {
                return _PortalImageURL;
            }
            set
            {
                _PortalImageURL = value;
            }
        }
    }

    // 公告內容
    public class PortalListDetail
    {
        // 公告內容
        private string _PortalContent;
        public string PortalContent
        {
            get
            {
                return _PortalContent;
            }
            set
            {
                _PortalContent = value;
            }
        }
    }

    //商店清單
    public class StoreList
    {
        //商家序號
        private int _StoreID;
        public int StoreID
        {
            get
            {
                return _StoreID;
            }
            set
            {
                _StoreID = value;
            }
        }

        private string _Category;
        public string Category
        {
            get
            {
                return _Category;
            }
            set
            {
                _Category = value;
            }
        }

        private string _County;
        public string County
        {
            get
            {
                return _County;
            }
            set
            {
                _County = value;
            }
        }

        private string _Township;
        public string Township
        {
            get
            {
                return _Township;
            }
            set
            {
                _Township = value;
            }
        }

        private string _Subject;
        public string Subject
        {
            get
            {
                return _Subject;
            }
            set
            {
                _Subject = value;
            }
        }

        private string _Address;
        public string Address
        {
            get
            {
                return _Address;
            }
            set
            {
                _Address = value;
            }
        }

        private string _Position;
        public string Position
        {
            get
            {
                return _Position;
            }
            set
            {
                _Position = value;
            }
        }

        private string _ContactPerson;
        public string ContactPerson
        {
            get
            {
                return _ContactPerson;
            }
            set
            {
                _ContactPerson = value;
            }
        }

        private string _Email;
        public string Email
        {
            get
            {
                return _Email;
            }
            set
            {
                _Email = value;
            }
        }

        private string _Phone;
        public string Phone
        {
            get
            {
                return _Phone;
            }
            set
            {
                _Phone = value;
            }
        }

        private string _Date1;
        public string Date1
        {
            get
            {
                return _Date1;
            }
            set
            {
                _Date1 = value;
            }
        }

        private string _Date2;
        public string Date2
        {
            get
            {
                return _Date2;
            }
            set
            {
                _Date2 = value;
            }
        }

        private string _Summary;
        public string Summary
        {
            get
            {
                return _Summary;
            }
            set
            {
                _Summary = value;
            }
        }

        private string[] _Images;
        public string[] Images
        {
            get
            {
                return _Images;
            }
            set
            {
                _Images = value;
            }
        }

        private string _UpdateDate;
        public string UpdateDate
        {
            get
            {
                return _UpdateDate;
            }
            set
            {
                _UpdateDate = value;
            }
        }
    }
}
