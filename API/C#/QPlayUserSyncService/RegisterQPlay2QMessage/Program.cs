using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RegisterQPlay2QMessage
{
    public class Program
    {
        static void Main(string[] args)
        {
            SyncJob job = new SyncJob();
            job.Run();
        }
    }
}
