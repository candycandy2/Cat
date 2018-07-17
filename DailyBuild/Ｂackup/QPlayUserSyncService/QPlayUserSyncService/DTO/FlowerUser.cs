using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace QPlayUserSyncService.DTO
{
    public class FlowerUser
    {
        public string EMP_NO { get; set; }
        public string LOGIN_NAME { get; set; }
        public string EMP_NAME { get; set; }
        public string EXT_NO { get; set; }
        public string EMAIL_ACCOUNT { get; set; }        
        public string DOMAIN { get; set; }
        public string SITE_CODE { get; set; }
        public string COMPANY { get; set; }
        public string DEPT_CODE { get; set; }
        public string ACTIVE { get; set; }
        public DateTime DIMISSION_DATE { get; set; }
    }
}
