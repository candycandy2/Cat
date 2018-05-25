using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace QPlayUserSyncService.DTO
{
    [Serializable]
    public class User
    {
        public string row_id { get; set; }
        public string login_id { get; set; }
        public string emp_no { get; set; }
        public string emp_name { get; set; }
        public string email { get; set; }
        public string ext_no { get; set; }
        public string user_domain { get; set; }
        public string company { get; set; }
        public string department { get; set; }
        public string status { get; set; }
        public string resign { get; set; }
        public int created_user { get; set; }
        public int updated_user { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public DateTime deleted_at { get; set; }
    }
}
