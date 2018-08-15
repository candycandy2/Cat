using System;
using System.Data;
using ITS.Data;
using System.IO;
using System.Diagnostics;
using log4net;
using ITS.Common.Excel;
using MySql.Data;
using MySql.Data.MySqlClient;

namespace QPlay.Job.SyncGaiaUser
{
    public class Program
    {
        static ILog log = LogManager.GetLogger("Logger");
        static void Main(string[] args)
        {
            DataTable dt = Init();
            string fileName = GenerateFile(dt);
            GenerateGPGFile(fileName);
        }
        /// <summary>
        /// 初始化
        /// </summary>
        static DataTable Init()
        {
            DataTable dt = new DataTable();

            string maxRows = System.Configuration.ConfigurationManager.AppSettings["MaxRows"];
            //if (maxRows.Trim().Length > 0) maxRows = " TOP " + maxRows + " ";
            string view = System.Configuration.ConfigurationManager.AppSettings["ViewName"];
            string sql = "SELECT " + maxRows + " * FROM " + view;
            log.Info("sql = (" + sql + ")#");

            //For mySQL
            string mysqlstring = System.Configuration.ConfigurationManager.AppSettings["MySQL"];
            log.Info("AppSettings[MySQL] = (" + mysqlstring + ")#");
            if (mysqlstring.Length > 0)
            {

                MySqlConnection mysqlconnection;
                //string connstring = string.Format("Server=10.82.246.95; database={0}; UID=eHRDB; password=kXGvVuVhV8HeDpDE", "qplay");
                //log.Info("connstring = (" + connstring + ")#");
                log.Info("0");
                mysqlconnection = new MySqlConnection(mysqlstring);
                log.Info("1");
                mysqlconnection.Open();
                log.Info("2");
                var cmd = new MySqlCommand(sql, mysqlconnection);
                log.Info("3");
                var reader = cmd.ExecuteReader();
                log.Info("4");
                dt.BeginLoadData();
                dt.Load(reader); // throws ConstraintException
                dt.EndLoadData();
                log.Info("5");
            }
            else
            //For SQL Server
            {
                //对数据库连接字符串解密
                log.Info("Begin Connect Gaia DB");
                DbSession dbGaia = new DbSession("dbGaia");
                log.Info("End Connect Gaia DB");
                //查询数据
                log.Info("Begin Select  data");
                dt = dbGaia.FromSql(sql).ToDataTable();
                log.Info("End Select  data");
            }

            return dt;
        }
        /// <summary>
        /// 产生excel
        /// </summary>
        /// <returns></returns>
        static string GenerateFile(DataTable dt)
        {
            try
            {
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
                DataTableToXls(dt);
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
        static void GenerateGPGFile(string orgfileName)
        {
            try
            {
                log.Info("Begin Exists Gaia GPGFile");

                string gpgfileName = orgfileName + ".gpg";
                //判断是否存在加密文件
                if (File.Exists(gpgfileName))
                {
                    File.Delete(gpgfileName);//如果存在则删除
                    log.Info("delete Exists Gaia GPGFile:" + gpgfileName);

                }
                log.Info("End Exists Gaia GPGFile");

                string cmdname = "gpg --recipient qlay --encrypt";
                string strInput = cmdname + " \"" + orgfileName + "\"";
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

                if (File.Exists(orgfileName + ".gpg"))
                {
                    log.Info("GPG:encryption succeeded:" + orgfileName + ".gpg");
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
                if (File.Exists(orgfileName))
                {
                    File.Delete(orgfileName);//如果存在则删除
                }
            }

        }

        static void DataTableToXls(DataTable dt)
        {
            //将查询出来的数据导出到Excel  
            QWorkbook workbook = new QWorkbook(QXlFileFormat.xls);//创建工作簿，默认是xls   

            log.Info("Start ReadDataTable");//slow when dt is bigger than 10000    
            workbook.ReadDataTable(dt);  // 读取DataTable的内容并写入excel所有的列 
            log.Info("End ReadDataTable");

            string xlsfileName = DateTime.Now.ToString("yyyyMMdd") + ".xls";
            string path = System.Configuration.ConfigurationManager.AppSettings["FilePath"];
            xlsfileName = path + "\\" + xlsfileName;


            log.Info("check xls file: " + xlsfileName);
            workbook.SaveAs(xlsfileName);
            workbook = null;
            log.Info("ExcelFile:Generate excel succeeded");

            GenerateGPGFile(xlsfileName);
        }

        static void DataTableToCSV(string fileName, DataTable dt)
        {
            int CurrentCol = 0;//当前列
            int RowCount = dt.Rows.Count + 1;//总行数
            int ColCount = dt.Columns.Count;//总列数

            log.Info("RowCount:" + RowCount);
            log.Info("ColCount:" + ColCount);

            StreamWriter sw = new StreamWriter(fileName, false);//文件如果存在，则自动覆盖
            try
            {
                int DatetimefieldIndex = -1;
                #region 表头信息
                for (CurrentCol = 0; CurrentCol < ColCount; CurrentCol++)
                {
                    if (dt.Columns[CurrentCol].DataType == typeof(DateTime))
                        DatetimefieldIndex = CurrentCol;
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
                            if (DatetimefieldIndex == CurrentCol)
                            {
                                //2018-07-27 09:46:07,098 [1] INFO  Logger - Exception:Specified cast is not valid.
                                //test on ITY-WEB1605
                                //sw.Write(((DateTime)row[CurrentCol]).ToString("yyyy-MM-dd HH:mm:ss").Trim());
                                sw.Write("");
                            }
                            else
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
            catch (Exception e)
            {
                log.Info("Exception:" + e.Message);
            }
            finally
            {
                sw.Close();
                sw = null;
            }
        }

    }
}