using jmessage.common;
using jmessage.user;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;

namespace RegisterQPlay2QMessage
{
    public class SyncJob
    {
        private MySqlConnection _dbQPlay;

        public SyncJob() : base()
        {
            _dbQPlay = new MySqlConnection(ConfigurationManager.ConnectionStrings["qplay"].ToString());
        }

        public void Run()
        {
            bool result = RegisterQPLayUser2QMessage();
        }

        private bool RegisterQPLayUser2QMessage()
        {
            List<string> userList = GetQPlayUsersList();
            bool result = Register2QMessage(userList);
            return result;
        }

        private bool Register2QMessage(List<string> userList)
        {
            Console.WriteLine("User Count:" + userList.Count);
            //userList = userList.Take(5).ToList();
            //string appKey = ConfigurationManager.AppSettings.Get("jmessage_app_key");
            //string masterSecret = ConfigurationManager.AppSettings.Get("jmessage_master_secret");
            //UserClient client = new UserClient(appKey, masterSecret);
            List<string> user2AddList = new List<string>();
            try
            {
                userList.ForEach(x =>
                            {
                                //UserPayload user = new UserPayload(x, GetPwdByLoginId(x));
                                //List<UserPayload> users = new List<UserPayload> { user };
                                //ResponseWrapper content = client.registUser(users);
                                //if (content.responseCode == System.Net.HttpStatusCode.Created || (content.responseContent.Contains("899001")))
                                //{
                                //    user2AddList.Add(x);
                                //}
                                string result = PostJson2Qmessage("{\"username\":\"" + x + "\"}");
                                Console.WriteLine("User:" + x + ";Response:" + result);
                                if (result.Contains("Success") || result.Contains("899001"))
                                {
                                    user2AddList.Add(x);
                                }
                            });
            }
            catch (Exception)
            {
                return false;
            }
            UpdateUserStatus(user2AddList);
            return true;
        }

        public string GetPwdByLoginId(string login_Id)
        {
            string pwd = login_Id + login_Id.Substring(0, 3);
            string hmac_key = ConfigurationManager.AppSettings.Get("registerKey");

            //HMAC-SHA256
            HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(hmac_key));
            byte[] sha256String = hmac.ComputeHash(Encoding.UTF8.GetBytes(pwd));
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < sha256String.Length; i++)
            {
                sb.Append(sha256String[i].ToString("x2"));
            }
            pwd = sb.ToString();

            //MD5
            MD5 md5 = MD5.Create();
            byte[] data = md5.ComputeHash(Encoding.UTF8.GetBytes(pwd));
            sb = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sb.Append(data[i].ToString("x2"));
            }
            pwd = sb.ToString();
            return pwd;
        }

        private void UpdateUserStatus(List<string> user2AddList)
        {
            if (user2AddList.Count == 0)
            {
                return;
            }
            string users = string.Empty;
            user2AddList.ForEach(x =>
            {
                users += "'" + x + "',";
            });
            users = users.TrimEnd(',');
            string sql = @"update qp_user set Register_Message = 'Y' where login_id in (" + users + ")";
            _dbQPlay.Open();
            using (MySqlCommand cmd = new MySqlCommand(sql, _dbQPlay))
            {
                //MySqlParameter para = new MySqlParameter("@users", MySqlDbType.VarChar, 50);
                //para.Value = users;
                //cmd.Parameters.Add(para);
                cmd.ExecuteNonQuery();
            }
            _dbQPlay.Close();
        }

        private List<string> GetQPlayUsersList()
        {
            string sql = @"select * from qp_user where resign = 'N' and status = 'Y' and Register_Message = 'N' and row_id in (select user_row_id from qp_register where status = 'A')";
            List<string> loginIdList = new List<string>();
            _dbQPlay.Open();
            using (MySqlCommand cmd = new MySqlCommand(sql, _dbQPlay))
            {
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    if (reader.HasRows)
                    {
                        loginIdList.Add(reader.GetString("login_id"));
                    }
                }
                reader.Close();
            }
            _dbQPlay.Close();
            return loginIdList;
        }

        public string PostJson2Qmessage(string data)
        {
            try
            {
                string url = ConfigurationManager.AppSettings["register_url"];
                WebClient wc = new WebClient();
                wc.Headers.Add("Content-Type", "application/json");
                wc.Headers.Add("Accept", "*/*");
                wc.Headers.Add("Accept-Encoding", "gzip, deflate");
                wc.Headers.Add("Accept-Language", "en -US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4");
                byte[] postData = Encoding.UTF8.GetBytes(data);
                NetworkCredential credential = new NetworkCredential(ConfigurationManager.AppSettings["username"], ConfigurationManager.AppSettings["password"]);
                WebProxy proxy = new WebProxy(ConfigurationManager.AppSettings["proxy_url"], true, null, credential);
                wc.Proxy = proxy;
                byte[] responseData = wc.UploadData(url, "POST", postData);
                return Encoding.UTF8.GetString(responseData);
            }
            catch (Exception e)
            {
                return "";
            }

        }
    }
}
