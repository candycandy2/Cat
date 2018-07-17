using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace QPlayUserSyncService.DTO
{
    public class LoginIDRegisterIDTagDTO
    {
        public string Company { get; set; }
        public string LoginID { get; set; }
        public string RegisterID { get; set; }
        public string Tag { get {
            return GetTagByCompanyLoginID(this.Company, this.LoginID);
        } }

        private string GetTagByCompanyLoginID(string company, string loginID)
        {
            company = company.ToUpper();
            string firstLetter = loginID.Substring(0, 1);
            firstLetter = firstLetter.ToUpper();
            switch (firstLetter)
            {
                case "A":
                case "B":
                case "C":
                case "D":
                    return company + "1";
                case "E":
                case "F":
                case "G":
                case "H":
                    return company + "2";
                case "I":
                case "J":
                case "K":
                case "L":
                    return company + "3";
                case "M":
                case "N":
                case "O":
                case "P":
                    return company + "4";
                case "Q":
                case "R":
                case "S":
                case "T":
                    return company + "5";
                default:
                    return company + "6";
            }
        }
    }
}
