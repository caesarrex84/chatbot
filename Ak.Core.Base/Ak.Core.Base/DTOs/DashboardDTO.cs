using Ak.Core.Base.Wrappers;

namespace Ak.Core.Base.DTOs
{

    public class DashboardDTO
    {
        public DashboardDTO() 
        {
            for (int i = 1; i < 13; i++)
            {
                this.Months.Add(new DashboardItem() { Label = APITools.monthName(i), Value = 0 });
                this.Tokens.Add(new DashboardItem() { Label = APITools.monthName(i), Value = 0 });
                this.Querys.Add(new DashboardItem() { Label = APITools.monthName(i), Value = 0 });
            }
            for (int i = 1; i <= DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month); i++)
                this.CurrentMonth.Add(new DashboardItem() { Label = i.ToString(), Value = 0 });
        }

        public List<DashboardItem> Months { get; set; } = new List<DashboardItem>();
        public List<DashboardItem> CurrentMonth { get; set; } = new List<DashboardItem>();
        public List<DashboardItem> CurrentMonthContact { get; set; } = new List<DashboardItem>();
        public List<DashboardItem> Tokens { get; set; } = new List<DashboardItem>();
        public List<DashboardItem> Querys { get; set; } = new List<DashboardItem>();
        public Int32 CurrentMontQuerys { get; set; } = 0;
        public Int32 CurrentMontTokens { get; set; } = 0;
    }

    public class DashboardItem
    {
        public DashboardItem()
        {

        }

        public string Label { get; set; } = String.Empty;
        public Int32 Value { get; set; }
    }

}
