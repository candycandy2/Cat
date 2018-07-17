using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using QPlayUserSyncService;

namespace Test
{
    class Program
    {
        static void Main(string[] args)
        {
            SyncJob job = new SyncJob();
            job.Run();
        }
    }
}
