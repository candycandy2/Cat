using System;
using System.Data;
using ITS.Data;
using System.IO;
using System.Diagnostics;
using log4net;

namespace QPlay.Job.SyncGaiaUser
{
    public class Program
    {
        static DbSession dbGaia;
        static ILog log = LogManager.GetLogger("Logger");
        static void Main(string[] args)
        {
            Init();
            string fileName = GenerateFile();
            GenerateGPGFile(fileName);
        }
        /// <summary>
        /// 初始化
        /// </summary>
        static void Init()
        {
            //对数据库连接字符串解密
            log.Info("Begin Connect Gaia DB");
            dbGaia = new DbSession("dbGaia");
            log.Info("End Connect Gaia DB");


        }
        /// <summary>
        /// 产生excel
        /// </summary>
        /// <returns></returns>
        static string GenerateFile()
        {
            try
            {
                log.Info("Begin Select data");

                //查询数据
                string maxRows = System.Configuration.ConfigurationManager.AppSettings["MaxRows"];
                //if (maxRows.Trim().Length > 0) maxRows = " TOP " + maxRows + " ";
                string view = System.Configuration.ConfigurationManager.AppSettings["ViewName"];
                string sql = "SELECT " + maxRows + " * FROM " + view;
                //string sql = "SELECT TOP " + maxRows + " emp_no,login_name,emp_name,ext_no,mail_account,domain,site_code,company,dept_code,active,dimission_date FROM " + view;
                DataTable dt = dbGaia.FromSql(sql).ToDataTable();
                log.Info("End Select  data");

                string fileName = DateTime.Now.ToString("yyyyMMdd") + ".csv";
                string path = System.Configuration.ConfigurationManager.AppSettings["FilePath"];
                fileName = path + "\\" + fileName;

                log.Info("check Directory: " + path);
                if (!Directory.Exists(path))//如果不存在就创建file文件夹
                {
                    log.Info("CreateDirectory: " + path);
                    Directory.CreateDirectory(path);
                }

                log.Info("check file: " + fileName);
                DataTableToCSV(fileName, dt);
                return fileName;
            }
            catch (Exception ex)
            {
                log.Info("ExcelFile:Generate excel failed");
                log.Error(ex.Message);
                return null;

            }
        }
        /// <summary>
        /// 将产生的excel进行加密
        /// </summary>
        /// <param name="fileName"></param>
        static void GenerateGPGFile(string fileName)
        {
            try
            {
                log.Info("Begin Exists Gaia GPGFile");

                string filename = fileName + ".gpg";
                //判断是否存在加密文件
                if (File.Exists(filename))
                {
                    File.Delete(filename);//如果存在则删除

                }
                log.Info("End Exists Gaia GPGFile");

                string cmdname = "gpg --recipient qlay --encrypt";
                string strInput = cmdname + " \"" + fileName + "\"";
                Process p = new Process();
                //设置要启动的应用程序
                p.StartInfo.FileName = "cmd.exe";
                //是否使用操作系统shell启动
                p.StartInfo.UseShellExecute = false;
                // 接受来自调用程序的输入信息
                p.StartInfo.RedirectStandardInput = true;
                //输出信息
                p.StartInfo.RedirectStandardOutput = true;
                // 输出错误
                p.StartInfo.RedirectStandardError = true;
                //不显示程序窗口
                p.StartInfo.CreateNoWindow = true;
                //启动程序
                p.Start();

                //向cmd窗口发送输入信息
                p.StandardInput.WriteLine(strInput);
                p.StandardInput.WriteLine("exit");
                p.StandardInput.AutoFlush = true;

                //获取输出信息
                string strOuput = p.StandardOutput.ReadToEnd();
                //等待程序执行完退出进程
                p.WaitForExit();
                p.Close();

                if (File.Exists(fileName + ".gpg"))
                {
                    log.Info("GPG:encryption succeeded:" + fileName + ".gpg");
                }
                else
                {
                    log.Info("GPG:encryption fail");
                }

            }
            catch (Exception ex)
            {
                log.Info("GPG:encryption failed");
                log.Error(ex.Message);
            }
            finally
            {
                //删除存在的excel
                if (File.Exists(fileName))
                {
                    File.Delete(fileName);//如果存在则删除
                }
            }

        }

        static void DataTableToCSV(string fileName, DataTable dt)
        {
            int CurrentCol = 0;//当前列
            int RowCount = dt.Rows.Count + 1;//总行数
            int ColCount = dt.Columns.Count;//总列数
            StreamWriter sw = new StreamWriter(fileName, false);//文件如果存在，则自动覆盖
            try
            {
                #region 表头信息
                for (CurrentCol = 0; CurrentCol < ColCount; CurrentCol++)
                {
                    sw.Write(dt.Columns[CurrentCol].ColumnName.ToString().Trim());
                    if ((CurrentCol + 1) < ColCount)
                        sw.Write(",");
                }
                sw.WriteLine("");
                #endregion

                #region excel表格内容
                foreach (DataRow row in dt.Rows)
                {
                    for (CurrentCol = 0; CurrentCol < ColCount; CurrentCol++)
                    {
                        if (row[CurrentCol] != null)
                        {
                            sw.Write(row[CurrentCol].ToString().Trim());
                        }
                        else
                        {
                            sw.Write("");
                        }
                        if ((CurrentCol + 1) < ColCount)
                            sw.Write(",");
                    }
                    sw.WriteLine("");
                }
                #endregion
            }
            catch
            { }
            finally
            {
                sw.Close();
                sw = null;
            }
        }

    }
}