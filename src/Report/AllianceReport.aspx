<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AllianceReport.aspx.cs" Inherits="CTXProject.Web.Report.AllianceReport" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=12.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<%@ Register assembly="AspNetPager" namespace="Wuqi.Webdiyer" tagprefix="webdiyer" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link href="CommonStyle.css" rel="stylesheet" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <style type="text/css">
        .auto-style1 {
            font-size: large;
            text-align: center;
        }
        .auto-style2 {
            text-align: left;
        }
    </style>
</head>
<body>
    <script src="My97DatePicker/WdatePicker.js"></script>
    <form id="form1" runat="server">
        <asp:scriptmanager runat="server"></asp:scriptmanager>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <h1 class="auto-style1">联盟商信息汇总表--<%=title %>
        </h1>
        <div class="margin-right:20px">
            <webdiyer:AspNetPager ID="AspNetPager1" runat="server" OnPageChanging="AspNetPager1_PageChanging" ShowCustomInfoSection="Left" ShowNavigationToolTip="True" HorizontalAlign="Right" AlwaysShow="True" CustomInfoHTML="&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;共&lt;font color='red'&gt;%RecordCount%&lt;/font&gt; 条记录,当前页 &amp;nbsp;&amp;nbsp;&lt;font color='red'&gt;%CurrentPageIndex%&lt;/font&gt; of %PageCount%" FirstPageText="第一页" LastPageText="最后一页" NextPageText="下一页" PrevPageText="上一页" ToolTip="Pager Navigation" SubmitButtonClass="AspPagerNext_Button" PageSize="1" Width="90%">
        </webdiyer:AspNetPager>
        </div>
        <div class="auto-style2">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          审核状态:  <asp:DropDownList ID="ddlAuditStatus" runat="server">
                <asp:ListItem Value="-1">全部</asp:ListItem>
                <asp:ListItem Value="0">未审核</asp:ListItem>
                <asp:ListItem Value="1">初审不通过</asp:ListItem>
                <asp:ListItem Value="2">初审通过</asp:ListItem>
                <asp:ListItem Value="3">终审不通过</asp:ListItem>
                <asp:ListItem Value="4">终审通过</asp:ListItem>
            </asp:DropDownList>
          
        &nbsp;开始时间&nbsp; &nbsp;
                <input id="datestart" class="Wdate" runat="server" onfocus="WdatePicker({lang:'zh-cn'})" type="text" />&nbsp; 结束时间
                <input id="dateend" class="Wdate" runat="server" onfocus="WdatePicker({lang:'zh-cn'})" type="text" /> <asp:CheckBox ID="cbViewdown" runat="server" Text="是否查看下级" Checked="True" />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <asp:Button ID="btnSearch" runat="server" OnClick="btnSearch_Click" Text="查找" />
          
        </div>
        

    <div>
        <rsweb:ReportViewer ID="ReportViewer1" runat="server" Height="632px" Width="100%" Font-Names="Verdana" Font-Size="8pt" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt" DocumentMapWidth="98%">
            <LocalReport ReportPath="Report\AllianceReport.rdlc">
            </LocalReport>
        </rsweb:ReportViewer>
    
    </div>
 <div class="Import_Font">
         <asp:Label ID="Label1" runat="server" Text=" &amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;合计:" Font-Bold="True" ForeColor="#CC0000"></asp:Label>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;员工数量:&nbsp;<asp:Label ID="lblUserNum" runat="server" Font-Bold="True"></asp:Label>
     &nbsp;车源数量:<asp:Label ID="lblCarNum" runat="server" Font-Bold="True"></asp:Label>
     &nbsp;零售总额:<asp:Label ID="lblTotalPrice" runat="server" Font-Bold="True"></asp:Label>
     &nbsp;购车数量: <asp:Label ID="lblbuyordernum" runat="server" Font-Bold="True"></asp:Label>
     &nbsp;购车总额: <asp:Label ID="lblbuytotalprice" runat="server" Font-Bold="True"></asp:Label>
     &nbsp;卖车数量:<asp:Label ID="lblsellordernum" runat="server" Font-Bold="True"></asp:Label>
     &nbsp;卖车总额: <asp:Label ID="lblselltotalprice" runat="server" Font-Bold="True"></asp:Label>
     &nbsp;购车好评率: <asp:Label ID="lblavgbuygoodrate" runat="server" Font-Bold="True"></asp:Label>
         购车悔单:<asp:Label ID="lblbuycarregretcount" runat="server" Font-Bold="True"></asp:Label>
     &nbsp;卖车好评率<asp:Label ID="lblavgSellCargoodrate" runat="server" Font-Bold="True"></asp:Label>
     &nbsp;卖车悔单:<asp:Label ID="lblSellCarRegretCount" runat="server" Font-Bold="True"></asp:Label>
         跳单次数<asp:Label ID="lblsellskipordernum" runat="server" Font-Bold="True"></asp:Label>
     </div>
      
    </form>
</body>
</html>
