using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.DirectoryServices;
using System.DirectoryServices.ActiveDirectory;
using System.Linq;
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
            string loginId = HttpContext.Current.Request.Headers["loginid"];
            string pwd = HttpContext.Current.Request.Headers["password"];
            string domain = HttpContext.Current.Request.Headers["domain"];
            string strJson = "";

            try 
            {
                DirectoryEntry rootDSE = new DirectoryEntry("LDAP://rootDSE");
                string rootADPath = Convert.ToString(rootDSE.Properties["rootDomainNamingContext"].Value);
                string ldapPath = "LDAP://DC=" + domain + "," + rootADPath;
                string filter = "SAMAccountName=" + loginId;
                string[] props = new string[] { "userAccountControl" };
                DirectoryEntry de = new DirectoryEntry(ldapPath);
                Object obj = de.NativeObject;
                DirectorySearcher deSearch = new DirectorySearcher(de, filter, props, SearchScope.Subtree);
                deSearch.SearchScope = SearchScope.Subtree;
                SearchResult res = deSearch.FindOne();
                if (res == null)
                {
                    //throw new Exception("Username and/or Password incorrect");
                    strJson = new JObject(
                                  new JProperty("ResultCode", "997904"),
                                  new JProperty("Message", "Account Not Exist"),
                                  new JProperty("Content", "")
                              ).ToString();

                }
                if (Convert.ToBoolean(Convert.ToInt32(res.Properties["userAccountControl"][0]) & 0x0002))
                {
                    //throw new Exception("The windows account has been disabled!");
                    strJson = new JObject(
                                  new JProperty("ResultCode", "997904"),
                                  new JProperty("Message", "Account Has Been Disabled"),
                                  new JProperty("Content", "")
                              ).ToString();

                }
                //return true;

                try
                {
                    ldapPath = "";
                    if (!domain.EndsWith(".com", StringComparison.InvariantCultureIgnoreCase))
                    {
                        ldapPath = rootADPath;
                    }
                    string[] dcList = domain.Split('.');
                    for (int i = dcList.Length - 1; i >= 0; i--)
                    {
                        if (domain.EndsWith(".com", StringComparison.InvariantCultureIgnoreCase))
                        {
                            ldapPath = string.Format("DC={0},{1}", dcList[i], ldapPath);
                        }
                        else if (rootADPath.IndexOf("DC=" + dcList[i], 0, StringComparison.InvariantCultureIgnoreCase) < 0)
                        {
                            ldapPath = string.Format("DC={0},{1}", dcList[i], ldapPath);
                        }
                    }
                    //ldapPath = "LDAP://" + ldapPath;
                    ldapPath = serverPath + ldapPath;
                    if (ldapPath.EndsWith(","))
                    {
                        ldapPath = ldapPath.Remove(ldapPath.Length - 1, 1);
                    }
                    DirectoryEntry dse = new DirectoryEntry(ldapPath, domain + "\\" + loginId, pwd);
                    Object objs = dse.NativeObject;
                    DirectorySearcher dseSearch = new DirectorySearcher(dse, filter, props, SearchScope.Subtree);
                    dseSearch.SearchScope = SearchScope.Subtree;
                    SearchResult result = dseSearch.FindOne();
                    if (result == null)
                    {
                        //throw new Exception("Username and/or Password incorrect");
                        strJson = new JObject(
                                      new JProperty("ResultCode", "997904"),
                                      new JProperty("Message", "Password incorrect"),
                                      new JProperty("Content", "")
                                  ).ToString();

                    }
                    if (Convert.ToBoolean(Convert.ToInt32(result.Properties["userAccountControl"][0]) & 0x0002))
                    {
                        //throw new Exception("The windows account has been disabled!");
                        strJson = new JObject(
                                      new JProperty("ResultCode", "997904"),
                                      new JProperty("Message", "Account Has Been Disabled"),
                                      new JProperty("Content", "")
                                  ).ToString();

                    }

                    strJson = new JObject(
                                  new JProperty("ResultCode", "1"),
                                  new JProperty("Message", "Success"),
                                  new JProperty("Content", "")
                              ).ToString();

                }
                catch (Exception ex)
                {
                    strJson = new JObject(
                                  new JProperty("ResultCode", "997904"),
                                  new JProperty("Message", "Password incorrect"),
                                  new JProperty("Content", "")
                              ).ToString();

                }
            }
            catch (Exception ex)
            {
                strJson = new JObject(
                              new JProperty("ResultCode", "997904"),
                              new JProperty("Message", "Account Not Exist"),
                              new JProperty("Content", "")
                          ).ToString();
            }

            return strJson;

        }


        // 验证不区分帐号密码错误
        [WebMethod]
        public string ADAuthenticate()
        {
            //hard code
            //string serverPath = "LDAP://10.82.12.61";
            //string loginId = "qplay";
            //string pwd = "BenQ5678";

            string serverPath = System.Web.Configuration.WebConfigurationManager.AppSettings["serverPath"];
            string loginId = HttpContext.Current.Request.Headers["loginid"];
            string pwd = HttpContext.Current.Request.Headers["password"];
            string domain = HttpContext.Current.Request.Headers["domain"];
            string msg = "";

            try
            {
                DirectoryEntry rootDSE = new DirectoryEntry("LDAP://rootDSE");
                //DirectoryEntry rootDSE = new DirectoryEntry(serverPath);
                string rootADPath = Convert.ToString(rootDSE.Properties["rootDomainNamingContext"].Value);
                string ldapPath = "";
                if (!domain.EndsWith(".com", StringComparison.InvariantCultureIgnoreCase))
                {
                    ldapPath = rootADPath;
                }
                string[] dcList = domain.Split('.');
                for (int i = dcList.Length - 1; i >= 0; i--)
                {
                    if (domain.EndsWith(".com", StringComparison.InvariantCultureIgnoreCase))
                    {
                        ldapPath = string.Format("DC={0},{1}", dcList[i], ldapPath);
                    }
                    else if (rootADPath.IndexOf("DC=" + dcList[i], 0, StringComparison.InvariantCultureIgnoreCase) < 0)
                    {
                        ldapPath = string.Format("DC={0},{1}", dcList[i], ldapPath);
                    }
                }
                //ldapPath = "LDAP://" + ldapPath;
                ldapPath = serverPath + ldapPath;
                if (ldapPath.EndsWith(","))
                {
                    ldapPath = ldapPath.Remove(ldapPath.Length - 1, 1);
                }
                string filter = "SAMAccountName=" + loginId;
                string[] props = new string[] { "userAccountControl" };
                DirectoryEntry de = new DirectoryEntry(ldapPath, domain + "\\" + loginId, pwd);
                Object obj = de.NativeObject;
                DirectorySearcher deSearch = new DirectorySearcher(de, filter, props, SearchScope.Subtree);
                deSearch.SearchScope = SearchScope.Subtree;
                SearchResult res = deSearch.FindOne();
                if (res == null)
                {
                    //throw new Exception("Username and/or Password incorrect");
                    msg = "密码错误";
                    return msg;
                }
                if (Convert.ToBoolean(Convert.ToInt32(res.Properties["userAccountControl"][0]) & 0x0002))
                {
                    //throw new Exception("The windows account has been disabled!");
                    msg = "帐号被锁定";
                    return msg;
                }
                msg = "登录成功";
                return msg;


            }
            catch (Exception ex)
            {
                msg = "密码错误";
                return msg;
            }
        }




    }
}
