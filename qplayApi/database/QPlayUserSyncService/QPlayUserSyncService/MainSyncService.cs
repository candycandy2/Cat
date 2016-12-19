using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Timers;
using System.IO;

namespace QPlayUserSyncService
{
    partial class MainSyncService : ServiceBase
    {
        private Timer mTimer;

        public MainSyncService()
        {
            InitializeComponent();
            mTimer = new Timer();
            mTimer.Interval = 300000;
            mTimer.Enabled = true;
            mTimer.Elapsed += new System.Timers.ElapsedEventHandler(timer_Elapsed);
        }

        private void timer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            WriteLog("Start");

            try
            {
                SyncJob job = new SyncJob();
                job.Run();
            }
            catch (Exception ex)
            {
                WriteLog(ex.StackTrace);
            }

            WriteLog("End");
        }

        protected override void OnStart(string[] args)
        {
            WriteLog("Service Start");
        }

        protected override void OnStop()
        {
            mTimer.Enabled = false;
            WriteLog("Service Stop");
        }

        public static void WriteLog(string text)
        {

            string path = AppDomain.CurrentDomain.BaseDirectory;
            path = Path.Combine(path, "Logs\\" + DateTime.Now.ToString("yyyy-MM-dd"));

            if (!System.IO.Directory.Exists(path))
            {
                System.IO.Directory.CreateDirectory(path);
            }

            string fileFullName = Path.Combine(path, string.Format("{0}.log", DateTime.Now.ToString("yyyy-MM-dd")));

            using (StreamWriter output = File.AppendText(fileFullName))
            {
                output.WriteLine(DateTime.Now.ToString("HH:mm:ss") + " - " + text);

                output.Close();
            }
        }
    }
}
