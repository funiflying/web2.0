<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="EvalutionReport.aspx.cs" Inherits="CTXProject.Web.Report.EvalutionReport" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=12.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<%@ Register assembly="AspNetPager" namespace="Wuqi.Webdiyer" tagprefix="webdiyer" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link href="CommonStyle.css" rel="stylesheet" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <style type="text/css">
        .auto-style2 {
            text-align: left;
        }
    </style>
</head>
<body>
    <script src="My97DatePicker/WdatePicker.js"></script>
    <form id="form1" runat="server">
        <asp:scriptmanager runat="server"></asp:scriptmanager>
        <br />
        <div >
            <h1>客户委托评估汇总表-<%=title %></h1>
        </div>   
        <div>
    <webdiyer:AspNetPager ID="AspNetPager1" runat="server" OnPageChanging="AspNetPager1_PageChanging" ShowCustomInfoSection="Left" ShowNavigationToolTip="True" HorizontalAlign="Right" AlwaysShow="True" CustomInfoHTML="&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;共&lt;font color='red'&gt;%RecordCount%&lt;/font&gt; 条记录,当前页 &amp;nbsp;&amp;nbsp;&lt;font color='red'&gt;%CurrentPageIndex%&lt;/font&gt; of %PageCount%" FirstPageText="第一页" LastPageText="最后一页" NextPageText="下一页" PrevPageText="上一页" ToolTip="Pager Navigation" SubmitButtonClass="AspPagerNext_Button" PageSize="1" Width="95%">
        </webdiyer:AspNetPager>
        </div>
     
        <div class="auto-style2">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            订单状态:  <asp:DropDownList ID="ddlAuditStatus" runat="server">
                <asp:ListItem Value="-1">全部</asp:ListItem>
                <asp:ListItem Value="0">客户下单</asp:ListItem>
                <asp:ListItem Value="1">支付评估费用</asp:ListItem>
                <asp:ListItem Value="2">评估师接单</asp:ListItem>
                <asp:ListItem Value="3">完成评估检测报告</asp:ListItem>
                <asp:ListItem Value="4">客户评价</asp:ListItem>
                <asp:ListItem Value="5">评估师评价</asp:ListItem>
                <asp:ListItem Value="255">订单完成</asp:ListItem>
            </asp:DropDownList>
          
        &nbsp;&nbsp;
            &nbsp;开始时间&nbsp; &nbsp;
                <input id="datestart" class="Wdate" runat="server" onfocus="WdatePicker({lang:'zh-cn'})" type="text" />&nbsp; 结束时间
                <input id="dateend" class="Wdate" runat="server" onfocus="WdatePicker({lang:'zh-cn'})" type="text" />

                <asp:CheckBox ID="cbViewdown" runat="server" Text="是否查看下级" Checked="True" />
&nbsp;&nbsp;&nbsp;&nbsp;
            <asp:Button ID="btnSearch" runat="server" OnClick="btnSearch_Click" Text="查找" Width="40px" />
          
        </div>
        

    <div>
        <rsweb:ReportViewer ID="ReportViewer1" runat="server" Height="633px" Width="98%" Font-Names="Verdana" Font-Size="8pt" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt" DocumentMapWidth="98%">
            <LocalReport ReportPath="Report\EvalutionReport.rdlc">
            </LocalReport>
        </rsweb:ReportViewer>
    
    </div>
        <div style="position:relative;float:left; display:block; width:100%;">
            <p>
                <asp:Label ID="Label1" runat="server" Font-Bold="True" ForeColor="#CC0000" Text="&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;合计:"></asp:Label>
                &nbsp;&nbsp;&nbsp;总数:&nbsp;<asp:Label ID="lblOrderNum" runat="server" Font-Bold="True"></asp:Label>
                &nbsp;&nbsp;评估费用:&nbsp;<asp:Label ID="lblTotalAppraiserFee" runat="server" Font-Bold="True"></asp:Label>
                &nbsp;&nbsp;&nbsp;客户评价:&nbsp;<asp:Label ID="lblTotalUserGiveScore" runat="server" Font-Bold="True"></asp:Label>
                &nbsp;评估师评价:<asp:Label ID="lblTotalAppraiserGiveScore" runat="server" Font-Bold="True"></asp:Label>
                &nbsp;</p>
        </div>
    </form>
</body>
</html>
