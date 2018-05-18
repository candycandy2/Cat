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

namespace RelieveWebService
{
    /// <summary>
    /// RelieveForQPlayAPI 的摘要说明
    /// 20170415
    /// Hakkinen Coding
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
   
    [System.Web.Script.Services.ScriptService]
    public class RelieveForQPlayAPI : System.Web.Services.WebService
    {
        // 我的預約
        [WebMethod]
        public string QueryMyReserve(string strXml)
        {
            string strJson = "";
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                    <LayoutHeader><ReserveUser>1501005</ReserveUser><NowDate>20170331</NowDate></LayoutHeader>
				*/
                #endregion

                // 設定傳入參數
                string ReserveUser = xmlDoc.SelectSingleNode("//ReserveUser").InnerText; // 預約者EmpNo
                string NowDate = xmlDoc.SelectSingleNode("//NowDate").InnerText; // 預約日期

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(ReserveUser) && !string.IsNullOrEmpty(NowDate))
                {
                    // 回傳參數陣列宣告
                    List<MyReserveInfo> listMyReseroeInfo = new List<MyReserveInfo>();

                    // 我的預約 SQL Script
                    //string SQL = " Select Site, Convert( Nvarchar, STime, 112 ) as 'ReserveDate', STime as 'ReserveBeginTime', ETime as 'ReserveEndTime', OWVID as 'ReserveID' "
                    //           + " From Relieve_Booking_List_View "
                    //           + " Where 1=1 "
                    //           + "  And EmpNo = @ReserveUser "
                    //           + "  And ( "
                    //           //+ "          Convert( Nvarchar, STime, 112 ) > @NowDate or "
                    //           //+ "          ( "
                    //           //+ "             Convert( Nvarchar, STime, 112 ) = @NowDate "
                    //           //+ "             And " 
                    //           //+ "             Substring(Convert(Nvarchar(12), STime, 108),1,5) > Substring(Convert(Nvarchar(12), GetDate(), 108),1,5) " 
                    //           //+"                             Substring(Convert(Nvarchar(12), STime, 108),1,5) > Substring(Convert(Nvarchar(12), GetDate(), 108),1,5) " 
                    //           //+ "          ) "
                    //           + "         ETime > GetDate() "
                    //           + "      ) "
                    //           + " And Status = 1 "
                    //           + " Order by STime ";

                    string SQL = " Select Case When ClassIndex = 'RT' then 'QTT' When ClassIndex = 'RY' then 'QTY' When ClassIndex = 'RH' then 'QTH' Else '' End As Site, " 
                               + " Convert( Nvarchar, STime, 112 ) as 'ReserveDate', STime as 'ReserveBeginTime', ETime as 'ReserveEndTime', OWVID as 'ReserveID' "
                               + " From Relieve_Booking_Date "
                               + " Where 1=1 "
                               + "  And EmpNo = @ReserveUser "
                               + "  And ( "
                               + "         ETime > GetDate() "
                               + "      ) "
                               + " And Status = 1 "
                               + " Order by STime ";

                    // Begin 以下為SQL執行程式碼
                    string strConnString = ConfigurationManager.AppSettings["MyQisda.DataAccess.ConnectionString"];
                    SqlConnection SQLConn = new SqlConnection(strConnString);

                    // 開啟 SQLConn
                    SQLConn.Open();

                    // 設定執行參數
                    DataTable DataTableMyReserveInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand(SQL, SQLConn);
                    cmd.CommandType = CommandType.Text;

                    // Parameter 設定
                    cmd.Parameters.Add("@NowDate", SqlDbType.NVarChar, 8);
                    cmd.Parameters["@NowDate"].Value = NowDate;
                    cmd.Parameters.Add("@ReserveUser", SqlDbType.NVarChar, 50);
                    cmd.Parameters["@ReserveUser"].Value = ReserveUser;

                    // 設定Table取值
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTableMyReserveInfo);
                    // End 將執行後的資料存到DataTableMyReserveInfo

                    // 關閉連結 SQLConn
                    SQLConn.Close();

                    // 判斷我的預約是否有值
                    if (DataTableMyReserveInfo != null && DataTableMyReserveInfo.Rows.Count > 0)
                    {
                        for (int i = 0; i < DataTableMyReserveInfo.Rows.Count; i++)
                         {
                            MyReserveInfo myReserveInfo = new MyReserveInfo();
                            myReserveInfo.Site = DataTableMyReserveInfo.Rows[i]["Site"].ToString();
                            myReserveInfo.ReserveBeginTime = DataTableMyReserveInfo.Rows[i]["ReserveBeginTime"].ToString().Trim();
                            myReserveInfo.ReserveDate = DataTableMyReserveInfo.Rows[i]["ReserveDate"].ToString().Trim();
                            myReserveInfo.ReserveEndTime = DataTableMyReserveInfo.Rows[i]["ReserveEndTime"].ToString().Trim();
                            myReserveInfo.ReserveID = (Int64)DataTableMyReserveInfo.Rows[i]["ReserveID"];
                            listMyReseroeInfo.Add(myReserveInfo);
                        }

                        // 將資料存入 Json格式
                        strJson = new JObject(
                                    new JProperty("ResultCode", "1"),
                                    new JProperty("Content",
                                            new JArray(
                                                    //使用LINQ to JSON可直接在Select語句中生成Json資料，無須其他轉換過程
                                                    from p in listMyReseroeInfo
                                                    select new JObject(
                                                           new JProperty("Site", p.Site),
                                                           new JProperty("ReserveDate", p.ReserveDate),
                                                           new JProperty("ReserveBeginTime", p.ReserveBeginTime),
                                                           new JProperty("ReserveEndTime", p.ReserveEndTime),
                                                           new JProperty("ReserveID", p.ReserveID.ToString().Trim())
                                                           )   
                                                      )
                                            )
                                     ).ToString();
                    }
                    else
                    {
                        // 查無預約資料
                        strJson = new JObject(
                                    new JProperty("ResultCode", "023901"),
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

        // 當日預約明細
        [WebMethod]
        public string QueryReserveDetail(string strXml)
        {
            string strJson = "";
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                <LayoutHeader>
                  <Site>QTY</Site>
                  <ReserveDate>20170522</ReserveDate>
                </LayoutHeader>
        		*/
                #endregion

                // 設定傳入參數
                string Site = xmlDoc.SelectSingleNode("//Site").InnerText;
                string ReserveDate = xmlDoc.SelectSingleNode("//ReserveDate").InnerText;

                // 判斷傳入參數是否為空值
                if (!string.IsNullOrEmpty(Site) && !string.IsNullOrEmpty(ReserveDate))
                {
                    List<ReserveDetailInfo> listReserveDetailInfo = new List<ReserveDetailInfo>();

                    // 當日預約明細 SQL Script
                    string SQL = " Select isnull( RV.Nam,'' )  as 'Name', "
                               + "  isnull( RV.EmpNo, '' )  as 'Emp_No',"
                               + "  isnull( RV.Telno, '' )  as 'Ext_No',"
                               + "  isnull( RV.Email, '' )  as 'EMail', "
                               + "  isnull( Convert( Nvarchar(5), RV.STime, 114 ) , RT.Time ) as 'BTime', "
                               // + "  Case When RNO.BID is Not Null Then RNO.Status Else isnull( Convert( int, RV.Status ), 0 ) End as 'Status', "
                               //  20170811 Hakkinen 修正今天時間已過卻仍可預約
                               + "  Case When ( Convert(Nvarchar, GetDate(), 112) = @ReserveDate ) And ( Left( Convert(Nvarchar, GetDate(), 108),5) > isnull( Convert( Nvarchar(5), RV.STime, 114 ) , RT.Time ) ) Then 1 "
                               + "  When RNO.BID is Not Null Then RNO.Status Else isnull( Convert( int, RV.Status ), 0 ) End as 'Status', "
                               + "  isnull( RV.OWVID, '' )  as 'ReserveID' "
                               + " From Relieve_Time RT "
                               + " Left join Relieve_Booking_Date_View  RV "
                               + " on RT.TimeSite = RV.Site  "
                               + "  And RT.Time =  Convert( Nvarchar(5), RV.STime, 114 ) "
                               + "  And RV.Status = 1  "
                               + "  And RV.Site = @Site "
                               + "  And Convert( Nvarchar, RV.STime, 112 ) = @ReserveDate "
                               + " Left join Relieve_Not_Open_View RNO "
                               + " on RT.TimeSite = RNO.Site "
                               + "  And RT.Time =  Convert( Nvarchar(5), RNO.STime, 114 ) "
                               + "  And RNO.Status = 1  "
                               + "  And RNO.Site = @Site "
                               + "  And Convert( Nvarchar, RNO.STime, 112 ) = @ReserveDate "
                               + "  Where 1=1 "
                               + "   And RT.TimeSite = @Site ";

                    // Begin 以下為SQL執行程式碼
                    string strConnString = ConfigurationManager.AppSettings["MyQisda.DataAccess.ConnectionString"];
                    SqlConnection SQLConn = new SqlConnection(strConnString);

                    // 開啟 SQLConn
                    SQLConn.Open();

                    // 設定執行參數
                    DataTable DataTableReserveDetailInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand(SQL, SQLConn);
                    cmd.CommandType = CommandType.Text;

                    // Parameter 設定
                    cmd.Parameters.Add("@Site", SqlDbType.NVarChar, 3);
                    cmd.Parameters["@Site"].Value = Site;
                    cmd.Parameters.Add("@ReserveDate", SqlDbType.NVarChar, 8);
                    cmd.Parameters["@ReserveDate"].Value = ReserveDate;

                    // 設定Table取值
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTableReserveDetailInfo);
                    // End 將執行後的資料存到DataTableMyReserveInfo

                    // 關閉連結 SQLConn
                    SQLConn.Close();

                    // 判斷當日預約明細是否有值
                    if (DataTableReserveDetailInfo != null && DataTableReserveDetailInfo.Rows.Count > 0)
                    {
                        for (int i = 0; i < DataTableReserveDetailInfo.Rows.Count; i++)
                        {
                            ReserveDetailInfo reserveDetailInfo = new ReserveDetailInfo();
                            reserveDetailInfo.Name = DataTableReserveDetailInfo.Rows[i]["Name"].ToString().Trim();
                            reserveDetailInfo.Emp_No = DataTableReserveDetailInfo.Rows[i]["Emp_No"].ToString().Trim();
                            reserveDetailInfo.Ext_No = DataTableReserveDetailInfo.Rows[i]["Ext_No"].ToString().Trim();
                            reserveDetailInfo.EMail = DataTableReserveDetailInfo.Rows[i]["EMail"].ToString().Trim();
                            reserveDetailInfo.BTime = DataTableReserveDetailInfo.Rows[i]["BTime"].ToString().Trim();
                            reserveDetailInfo.Status = (int)DataTableReserveDetailInfo.Rows[i]["Status"];
                            reserveDetailInfo.ReserveID = (Int64)DataTableReserveDetailInfo.Rows[i]["ReserveID"];
                            listReserveDetailInfo.Add(reserveDetailInfo);
                        }
                    }

                    // 將資料存入 Json格式
                    strJson = new JObject(
                                   new JProperty("ResultCode", "1"),
                                   new JProperty("Content",
                                            new JArray(
                                                    //使用LINQ to JSON可直接在Select語句中生成Json資料，無須其他轉換過程
                                                    from p in listReserveDetailInfo
                                                    select new JObject(
                                                           new JProperty("Name", p.Name),
                                                           new JProperty("Emp_No", p.Emp_No),
                                                           new JProperty("Ext_No", p.Ext_No),
                                                           new JProperty("EMail", p.EMail),
                                                           new JProperty("BTime", p.BTime),
                                                           new JProperty("Status", p.Status.ToString().Trim()),
                                                           new JProperty("ReserveID", p.ReserveID.ToString().Trim())
                                                           )
                                                  )
                                            )
                                   ).ToString();
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

        // 預約
        [WebMethod]
        public string ReserveRelieve(string strXml)
        {
            string strJson = "";
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                    <LayoutHeader><Site>QTY</Site><ReserveDate>20170411</ReserveDate><ReserveUser>1501005</ReserveUser><BTime>08:30,09:00</BTime></LayoutHeader>
        		*/
                #endregion

                // 設定傳入參數
                string Site = xmlDoc.SelectSingleNode("//Site").InnerText;
                string ReserveDate = xmlDoc.SelectSingleNode("//ReserveDate").InnerText;
                string ReserveUser = xmlDoc.SelectSingleNode("//ReserveUser").InnerText;
                string BTime = xmlDoc.SelectSingleNode("//BTime").InnerText;

                // 判斷參數是否為空白
                if (!string.IsNullOrEmpty(Site) && !string.IsNullOrEmpty(ReserveDate) && !string.IsNullOrEmpty(ReserveUser) && !string.IsNullOrEmpty(BTime))
                {
                    String[] Substrings = BTime.Split(',');
                    
                    List<ReserveDetailInfo> ReserveDetailInfo = new List<ReserveDetailInfo>();
                    int QTTNum = Substrings.Length;
                    string SQL = "";
                    for (int i = 0; i <= Substrings.Length - 1; i++)
                    {
                        SQL += " Select RV.Nam as 'Name', RV.Telno as 'Ext_No' ,RV.Email as 'EMail' ,Convert( Nvarchar(5), RV.STime, 114 ) as 'BTime' ,Convert( int, RV.Status ) as 'Status' ,RV.OWVID as 'ReserveID'  "
                                   + " From Relieve_Booking_Date_View RV "
                                   + " Where 1=1 "
                                   + " And status = 1 "
                                   + " And Site = @Site "
                                   + " And Convert( Nvarchar, RV.STime, 112 ) = @ReserveDate "
                                   + " And Convert( Nvarchar(5), RV.STime, 114 ) = '" + Substrings[i].ToString().Trim() + "'  ";
                    }
                    // Begin 以下為SQL執行程式碼
                    string strConnString = ConfigurationManager.AppSettings["MyQisda.DataAccess.ConnectionString"];

                    SqlConnection SQLConn = new SqlConnection(strConnString);

                    // 開啟 SQLConn
                    SQLConn.Open();

                    // 設定執行參數
                    DataTable DataTableReserveDetailInfo = new DataTable();
                    SqlCommand cmd = new SqlCommand(SQL, SQLConn);
                    cmd.CommandType = CommandType.Text;

                    // Parameter 設定
                    cmd.Parameters.Add("@Site", SqlDbType.NVarChar, 3);
                    cmd.Parameters["@Site"].Value = Site;
                    cmd.Parameters.Add("@ReserveDate", SqlDbType.NVarChar, 8);
                    cmd.Parameters["@ReserveDate"].Value = ReserveDate;

                    // 設定傳入參數
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.Fill(DataTableReserveDetailInfo);
                    // End 將執行後的資料存到DataTableMyReserveInfo


                    // 判斷當日預約明細是否有值
                    if (DataTableReserveDetailInfo != null && DataTableReserveDetailInfo.Rows.Count > 0)
                    {
                        // 關閉連結 SQLConn
                        SQLConn.Close();
                        // 回傳預約失敗，有人預約
                        strJson = new JObject(
                                    new JProperty("ResultCode", "023904")
                                                  ).ToString();
                    }
                    else
                    {
                        // 查看是否有預約紀錄 -- 僅限 QTT
                        List<ReserveCountInfo> ReserveCountInfo = new List<ReserveCountInfo>();
                        string SQLCount = " Select EmpNo ,SYear ,SMonth ,BCount ,Site  "
                            + " From Relieve_BCount_Veiw "
                            + " Where 1=1 "
                            + "  And EmpNo = @EmpNo "
                            + "  And Site =  @Site "
                            + "  And SYear = Substring( @ReserveDate ,1 ,4 ) "
                            + "  And SMonth  = Substring( @ReserveDate ,5 ,2 ) ";

                        // Begin 以下為SQL執行程式碼

                        // 設定執行參數
                        DataTable DataTableReserveCountInfo = new DataTable();
                        cmd = new SqlCommand(SQLCount, SQLConn);
                        cmd.CommandType = CommandType.Text;

                        // Parameter 設定
                        cmd.Parameters.Add("@Site", SqlDbType.NVarChar, 3);
                        cmd.Parameters["@Site"].Value = Site;
                        cmd.Parameters.Add("@EmpNo", SqlDbType.NVarChar, 50);
                        cmd.Parameters["@EmpNo"].Value = ReserveUser;
                        cmd.Parameters.Add("@ReserveDate", SqlDbType.NVarChar, 8);
                        cmd.Parameters["@ReserveDate"].Value = ReserveDate;

                        da.SelectCommand = cmd;
                        da.Fill(DataTableReserveCountInfo);
                        // End 將執行後的資料存到DataTableMyReserveInfo

                        // 判斷預約紀錄是否有值
                        if (DataTableReserveCountInfo != null && DataTableReserveCountInfo.Rows.Count > 0)
                        {
                            QTTNum = QTTNum + (int)DataTableReserveCountInfo.Rows[0]["BCount"];
                        }
                        // 判斷是否為QTY , 因QTY不限制時數
                        else if (Site == "QTY")
                        {                           
                            QTTNum = 0;
                        }

                        // 判斷是否有超過預約限制
                        if ( QTTNum > 4)
                        {
                            // 關閉連結 SQLConn
                            SQLConn.Close();
                            // 預約失敗，已超出可預約的時數限制
                            strJson = new JObject(
                                        new JProperty("ResultCode", "023903")
                                                      ).ToString();
                        }
                        else
                        {
                            // 設定執行參數
                            cmd = new SqlCommand("usp_Relieve_Booking", SQLConn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            // Parameter 設定
                            cmd.Parameters.Add("@Site", SqlDbType.NVarChar, 3);
                            cmd.Parameters["@Site"].Value = Site;
                            cmd.Parameters.Add("@EmpNo", SqlDbType.NVarChar, 50);
                            cmd.Parameters["@EmpNo"].Value = ReserveUser;
                            cmd.Parameters.Add("@ReserveDate", SqlDbType.NVarChar, 8);
                            cmd.Parameters["@ReserveDate"].Value = ReserveDate;
                            cmd.Parameters.Add("@BTime", SqlDbType.NVarChar, 256);
                            cmd.Parameters["@BTime"].Value = BTime;
                            cmd.ExecuteNonQuery();

                            // 關閉連結 SQLConn
                            SQLConn.Close();

                            // 預約成功
                            strJson = new JObject(
                                        new JProperty("ResultCode", "023902")
                                                 ).ToString();
                        }
                    }
                }
                else
                {
                    // 傳入參數不足或傳入參數格式錯誤
                    strJson = new JObject(
                                    new JProperty("ResultCode", "999001")
                                        ).ToString();
                }

            }
            catch (Exception ex)
            {
                strJson = ex.Message.ToString();
            }
            return strJson;
        }

        // 取消預約
        [WebMethod]
        public string ReserveCancel(string strXml)
        {
            string strJson = "";
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(strXml);

                #region 輸入參數說明
                /*
                    <LayoutHeader><ReserveDate>20170417</ReserveDate><ReserveUser>1501005</ReserveUser><ReserveID>1491531409597</ReserveID></LayoutHeader>
                */
                #endregion

                // 設定傳入參數
                string ReserveDate = xmlDoc.SelectSingleNode("//ReserveDate").InnerText;
                string ReserveUser = xmlDoc.SelectSingleNode("//ReserveUser").InnerText;
                string ReserveID = xmlDoc.SelectSingleNode("//ReserveID").InnerText;

                // 判斷參數是否為空白
                if (!string.IsNullOrEmpty(ReserveDate) && !string.IsNullOrEmpty(ReserveUser) && !string.IsNullOrEmpty(ReserveID))
                {
                    // 設定取消預約日期和今日日期
                    DateTime NDate = DateTime.Now.Date;
                    DateTime RDate = DateTime.ParseExact(ReserveDate, "yyyyMMdd", System.Globalization.CultureInfo.InvariantCulture);
                    TimeSpan Total = RDate.Subtract(NDate);

                    int intTotal = Convert.ToInt32(Total.Days);

                    // 判斷取消預約日期是否大於1
                    if (intTotal > 1)
                    {
                        //string SQLUpdate = " Update Relieve_Booking_Date set Status = 0 "
                        //                 + " Where OWVID = @OWVID And EmpNo =  @EmpNo ;"
                        //                 + " Update Relieve_Booking_List "
                        //                 + " Set Status = 0 , CancelEmpNo = @EmpNo , CancelEmpName = @EmpNo , CancelDate = GetDate() "
                        //                 + " Where OWVID = @OWVID And EmpNo = @EmpNo ";
                        string SQLUpdate = " Update Relieve_Booking_Date set Status = 0 "
                                         + " Where OWVID = @OWVID And EmpNo =  @EmpNo ;"
                                         + " Update RBL "
                                         + " Set RBL.Status = 0, RBL.CancelEmpNo = MS.Emp_No, RBL.CancelEmpName = MS.Nam, RBL.CancelDate = GetDate() "
                                         + " From Relieve_Booking_List AS RBL Inner join Memberall_Simple AS MS on RBL.EmpNo = MS.Emp_No "
                                         + " Where RBL.OWVID = @OWVID And RBL.EmpNo = @EmpNo ";

                       // Begin 以下為SQL執行程式碼
                       string strConnString = ConfigurationManager.AppSettings["MyQisda.DataAccess.ConnectionString"];
                       SqlConnection SQLConn = new SqlConnection(strConnString);

                       // 開啟 SQLConn
                       SQLConn.Open();

                       // 設定執行參數
                       DataTable DataTableReserveDetailInfo = new DataTable();
                       SqlCommand cmd = new SqlCommand(SQLUpdate, SQLConn);
                       cmd.CommandType = CommandType.Text;

                       // Parameter 設定
                       cmd.Parameters.Add("@OWVID", SqlDbType.BigInt);
                       cmd.Parameters["@OWVID"].Value = ReserveID.Trim();
                       cmd.Parameters.Add("@EmpNo", SqlDbType.NVarChar, 50);
                       cmd.Parameters["@EmpNo"].Value = ReserveUser.Trim();
                       cmd.ExecuteNonQuery();

                       // 取消預約成功
                       strJson = new JObject(
                                     new JProperty("ResultCode", "023905")
                                     ).ToString();
                       // 關閉 SQLConn
                       SQLConn.Close();                    
                    }
                    else
                    {
                        // 取消預約失敗,兩日內預約無法取消
                        strJson = new JObject(
                                      new JProperty("ResultCode", "023906")
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
    }

    // 我的預約
    public class MyReserveInfo
    {
        // 預約ID
        private Int64 _ReserveID;
        public Int64 ReserveID
        {
            get
            {
                return _ReserveID;
            }
            set
            {
                _ReserveID = value;
            }
        }
        
        // SiteCode
        private string _Site;
        public string Site
        {
            get
            {
                return _Site;
            }
            set
            {
                _Site = value;
            }
        }
       
        // 預約日期
        private string _ReserveDate;
        public string ReserveDate
        {
            get
            {
                return _ReserveDate;
            }
            set
            {
                _ReserveDate = value;
            }
        }
       
        // 預約開始時間
        private string _ReserveBeginTime;
        public string ReserveBeginTime
        {
            get
            {
                return _ReserveBeginTime;
            }
            set
            {
                _ReserveBeginTime = value;
            }
        }
       
        // 預約結束時間
        private string _ReserveEndTime;
        public string ReserveEndTime
        {
            get
            {
                return _ReserveEndTime;
            }
            set
            {
                _ReserveEndTime = value;
            }
        }
    }

    // 當日預約明細
    public class ReserveDetailInfo
    {
        // 預約ID
        private Int64 _ReservID;
        public Int64 ReserveID
        {
            get
            {
                return _ReservID;
            }
            set
            {
                _ReservID = value;
            }
        }
        
        // 預約者姓名
        private string _Name;
        public string Name
        {
            get
            {
                return _Name;
            }
            set
            {
                _Name = value;
            }
        }

        // 預約者工號
        private string _Emp_No;
        public string Emp_No
        {
            get
            {
                return _Emp_No;
            }
            set
            {
                _Emp_No = value;
            }
        }
        
        // 預約者分機
        private string _Ext_No;
        public string Ext_No
        {
            get
            {
                return _Ext_No;
            }
            set
            {
                _Ext_No = value;
            }
        }
        
        // 預約者電子信箱
        private string _EMail;
        public string EMail
        {
            get
            {
                return _EMail;
            }
            set
            {
                _EMail = value;
            }
        }
        
        // 預約開始時間
        private string _BTime;
        public string BTime
        {
            get
            {
                return _BTime;
            }
            set
            {
                _BTime = value;
            }
        }
        
        // 預約狀態 0:可預約, 1:不可以預約
        private int _Status;
        public int Status
        {
            get
            {
                return _Status;
            }
            set
            {
                _Status = value;
            }
        }
    }

    // 預約時數總數
    public class ReserveCountInfo
    {
        // 工號
        private string _EmpNo;
        public string EmpNo
        {
            get
            {
                return _EmpNo;
            }
            set
            {
                _EmpNo = value;
            }
        }

        // 年份
        private string _Year;
        public string Year
        {
            get
            {
                return _Year;
            }
            set
            {
                _Year = value;
            }
        }

        //月份
        private string _Month;
        public string Month
        {
            get
            {
                return _Month;
            }
            set
            {
                _Month = value;
            }
        }

        // SiteCode
        private string _Site;
        public string Site
        {
            get
            {
                return _Site;
            }
            set
            {
                _Site = value;
            }
        }

        // 預約時數加總
        private int _Count;
        public int Count
        {
            get
            {
                return _Count;
            }
            set
            {
                _Count = value;
            }
        }
     }
   
}
