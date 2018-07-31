using Newtonsoft.Json.Linq;
using System;
using System.DirectoryServices;
using System.Web;
using System.Web.Services;

namespace QTunnel
{
    /// <summary>
    /// QTunnel 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]

    [System.Web.Script.Services.ScriptService]
    public class QTunnel : System.Web.Services.WebService
    {
        // Login验证用户名和密码
        [WebMethod]
        public string Login()
        {
            string serverPath = System.Web.Configuration.WebConfigurationManager.AppSettings["serverPath"];
            //serverPath => LDAP://10.82.12.61/DC=benq,DC=corp,DC=com or LDAP://10.10.1.8/DC=partner,DC=com,DC=tw 
            string loginId = HttpContext.Current.Request.Headers["loginid"];
            string pwd = HttpContext.Current.Request.Headers["password"];
            long signatureTime = long.Parse(HttpContext.Current.Request.Headers["Signature-Time"]);
            string strJson = "";

            long epoch = (DateTime.Now.ToUniversalTime().Ticks - 621355968000000000) / 10000000;
            long value = epoch - signatureTime;
            if (value < 15 * 60)
            {
                try
                {
                    DirectoryEntry dse = new DirectoryEntry(serverPath, loginId, pwd);
                    string filter = "SAMAccountName=" + loginId;
                    string[] props = new string[] { "userAccountControl" };
                    DirectorySearcher dseSearch = new DirectorySearcher(dse, filter, props, SearchScope.Subtree);
                    SearchResult result = dseSearch.FindOne();
                    if (result == null)
                    {
                        strJson = new JObject(
                                      new JProperty("ResultCode", "997902"),
                                      new JProperty("Message", "Password Incorrect" + serverPath + "@" + loginId),
                                      new JProperty("Content", "")
                                  ).ToString();

                    }
                    else if (Convert.ToBoolean(Convert.ToInt32(result.Properties["userAccountControl"][0]) & 0x0002))
                    {
                        strJson = new JObject(
                                      new JProperty("ResultCode", "997905"),
                                      new JProperty("Message", "Account Has Been Disabled" + serverPath + "@" + loginId),
                                      new JProperty("Content", "")
                                  ).ToString();

                    }

                    strJson = new JObject(
                                  new JProperty("ResultCode", "1"),
                                  new JProperty("Message", "Success" + serverPath + "@" + loginId),
                                  new JProperty("Content", "")
                              ).ToString();
                }
                catch (Exception ex) {
                    strJson = new JObject(
                                      new JProperty("ResultCode", "997904"),
                                      new JProperty("Message", "Account Incorrect" + serverPath + "@" + loginId + "@" + ex.Message),
                                      new JProperty("Content", ex.Message)
                                  ).ToString();
                }

            }
            else
            {
                strJson = new JObject(
                              new JProperty("ResultCode", "997906"),
                              new JProperty("Message", "Request Timeout"),
                              new JProperty("Content", "")
                          ).ToString();
            }

            return strJson;

        }

    }
}
