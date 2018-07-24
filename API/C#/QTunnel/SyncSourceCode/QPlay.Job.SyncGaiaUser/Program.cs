using System;
using System.Data;
using ITS.Data;
using ITS.Common.Excel;
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
            string fileName = GenerateExcelFile();
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
        static string GenerateExcelFile()
        {
            try
            {
                log.Info("Begin Select data");

                //查询数据
                string view = System.Configuration.ConfigurationManager.AppSettings["ViewName"];
                string sql = "SELECT TOP 20000 * FROM " + view;
                DataTable dt = dbGaia.FromSql(sql).ToDataTable();
                log.Info("End Select  data");

                //将查询出来的数据导出到Excel
                QWorkbook workbook = new QWorkbook(QXlFileFormat.xls);//创建工作簿，默认是xls

                log.Info("Start ReadDataTable");//slow when dt is bigger than 10000
                workbook.ReadDataTable(dt);  // 读取DataTable的内容并写入excel所有的列
                log.Info("End ReadDataTable");

                string fileName = DateTime.Now.ToString("yyyyMMdd") + ".xls";
                string path = System.Configuration.ConfigurationManager.AppSettings["FilePath"];
                fileName = path + "\\" + fileName;

                log.Info("check Directory: " + path);
                if (!Directory.Exists(path))//如果不存在就创建file文件夹
                {
                    log.Info("CreateDirectory: " + path);
                    Directory.CreateDirectory(path);
                }

                log.Info("check file: " + fileName);
                workbook.SaveAs(fileName);
                log.Info("ExcelFile:Generate excel succeeded");
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

                if(File.Exists(fileName+".gpg"))
                {
                    log.Info("GPG:encryption succeeded:" + fileName + ".gpg");
                }
                else {
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

    }
}