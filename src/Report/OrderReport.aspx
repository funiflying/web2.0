<%@ Page Language="C#" AutoEventWireup="true" EnableEventValidation="false"  CodeBehind="OrderReport.aspx.cs" Inherits="CTXProject.Web.OrderReport" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=12.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<%@ Register assembly="AspNetPager" namespace="Wuqi.Webdiyer" tagprefix="webdiyer" %>

<!DOCTYPE html>
<link href="CommonStyle.css" rel="stylesheet" />
<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">

    
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <style type="text/css">
        .auto-style1 {
            font-size: medium;
            text-align: center;
        }
        .auto-style2 {
            text-align: left;
        }
    </style>
</head>

<body>
        <script src="My97DatePicker/WdatePicker.js"></script>
     <script src="JS/Common.js"></script>
    <script src="JS/jquery-1.1.3.1.pack.js"></script>
    <script type="text/javascript">
	jQuery.noConflict();
</script>
     <script>
   function loadSecondCatalogData(firstCatalogObj_id, secondCatalogObj_id)
    {
    var ajaxUrl = "./Brand_Series.aspx";
    var objFirstCatalogList = $(firstCatalogObj_id);
    var objSecondCatalogList = $(secondCatalogObj_id);
    var lang_DataIsLoading = "加载中......";
    var lang_SelectTopCatalogFirst = "请选择第一级目录";
    var lang_allTopSecondCatalog = "全部";
    
    var data = {
        Action: "GetSeriesListByBrandID",
        BrandID : objFirstCatalogList.value.trim()
    }
    objSecondCatalogList.length = 0;
    if (objFirstCatalogList.value.trim() == "")
    {
        objSecondCatalogList.options[0] = new Option(lang_SelectTopCatalogFirst, "");
        return;
    }
    objSecondCatalogList.options[0] = new Option(lang_DataIsLoading, "");

    jQuery.get(ajaxUrl, data,
        function (xml) {
            var childCatalogs = xml.getElementsByTagName("SeriesList")[0].childNodes;
            var txtseriesID = "<%=seriestext.ClientID %>";
            var ddlseriesID = "<%=ddlseries.ClientID%>";
		    
		    if (childCatalogs.length==0)
		    {
		        document.getElementById(txtseriesID).style.display = "inline";
		        document.getElementById(ddlseriesID).style.display = "None";
		    
		    }
		    else
		    {
		        document.getElementById(txtseriesID).style.display = "None";
		        document.getElementById(ddlseriesID).style.display = "inline";
		    }
		    var childCatalog = null;
		    var catalogID = "";
		    var catalogName = "";
		    objSecondCatalogList.length = 0;
		    objSecondCatalogList.options[0] = new Option(lang_allTopSecondCatalog, "-1");
            for (var i = 0; i < childCatalogs.length; i++)
            {
                childCatalog = childCatalogs[i];
                catalogID = childCatalog.getAttribute("id");
                catalogName = childCatalog.firstChild.data;
                objSecondCatalogList.options[objSecondCatalogList.options.length] = new Option(catalogName, catalogID);
            }
            
        }
    ) // end of jQuery.get
    
   }


    </script>

    <form id="form1" runat="server">
            <asp:scriptmanager runat="server"></asp:scriptmanager>
        <div>
       <br />
                 <h1 class="auto-style1">车同享订单统计报表-<%=title%></h1>
            <br />
        </div>
            <div class="auto-style2">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                订单状态&nbsp;
                <asp:DropDownList ID="DropDownList1" runat="server">
                    <asp:ListItem Value="0"></asp:ListItem>
                    <asp:ListItem Value="1"></asp:ListItem>
                    <asp:ListItem>2</asp:ListItem>
                    <asp:ListItem>3</asp:ListItem>
                </asp:DropDownList>&nbsp;&nbsp;&nbsp;
                买家类型    :
                <asp:DropDownList ID="ddlbuyerstyle" runat="server">
                    <asp:ListItem Value="-1">全部</asp:ListItem>
                    <asp:ListItem Value="0">外网用户</asp:ListItem>
                    <asp:ListItem Value="1">联盟商</asp:ListItem>
                </asp:DropDownList>
                &nbsp; 车主类型
                <asp:DropDownList ID="ddlsellstyle" runat="server">
                    <asp:ListItem Value="-1">全部</asp:ListItem>
                    <asp:ListItem Value="0">外网用户</asp:ListItem>
                    <asp:ListItem Value="1">联盟商</asp:ListItem>
                </asp:DropDownList>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 品牌&nbsp;&nbsp;&nbsp;&nbsp;
                <asp:DropDownList ID="ddlBrand" runat="server" >
                    <asp:ListItem Value="-1">全部</asp:ListItem>
     
                </asp:DropDownList>
                &nbsp;
                系列&nbsp;&nbsp;
                <asp:DropDownList ID="ddlseries" runat="server" >
                    <asp:ListItem Value="-1">全部</asp:ListItem>
               
                </asp:DropDownList>
             <input id="seriestext" runat="server" style="display:none; " type="text" value="全部" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<%--             &nbsp;
                规格&nbsp;&nbsp;
                <asp:DropDownList ID="ddlspecs" runat="server" >
                    <asp:ListItem Value="-1">全部</asp:ListItem>
                </asp:DropDownList>

             <input id="specstext" runat="server" style="display:none; " type="text" value="全部" />&nbsp;&nbsp;&nbsp;--%>
             
                <asp:DropDownList ID="ddlprice" runat="server" >
                    <asp:ListItem Value="-1">价格</asp:ListItem>
               
                    <asp:ListItem Value="1">5万以下</asp:ListItem>
                    <asp:ListItem Value="2">5-10万</asp:ListItem>
                    <asp:ListItem Value="3">10-15万</asp:ListItem>
                    <asp:ListItem Value="4">15-20万</asp:ListItem>
                    <asp:ListItem Value="5">20-30万</asp:ListItem>
                    <asp:ListItem Value="6">30-40万</asp:ListItem>
                    <asp:ListItem Value="7">40-50万</asp:ListItem>
                    <asp:ListItem Value="8">50万以上</asp:ListItem>
               
                </asp:DropDownList>
             
            &nbsp;&nbsp;&nbsp;&nbsp;
                <asp:DropDownList ID="ddlcaryear" runat="server" >
                    <asp:ListItem Value="-1">车龄</asp:ListItem>
               
                    <asp:ListItem Value="1">1年以内 </asp:ListItem>
                    <asp:ListItem Value="2">3年内</asp:ListItem>
                    <asp:ListItem Value="3">5年内</asp:ListItem>
                    <asp:ListItem Value="4">5年以上</asp:ListItem>
               
                </asp:DropDownList>
             &nbsp;<%--             &nbsp;
                规格&nbsp;&nbsp;
                <asp:DropDownList ID="ddlspecs" runat="server" >
                    <asp:ListItem Value="-1">全部</asp:ListItem>
                </asp:DropDownList>

             <input id="specstext" runat="server" style="display:none; " type="text" value="全部" />&nbsp;&nbsp;&nbsp;--%>&nbsp;&nbsp;&nbsp;&nbsp;
                <asp:DropDownList ID="ddlcarstyle" runat="server" >
                    <asp:ListItem Value="-1">车型</asp:ListItem>
               
                    <asp:ListItem Value="1">小型车</asp:ListItem>
                    <asp:ListItem Value="2">紧凑车型</asp:ListItem>
                    <asp:ListItem Value="3">中型车</asp:ListItem>
                    <asp:ListItem Value="4">豪华型车</asp:ListItem>
                    <asp:ListItem Value="5">SUV</asp:ListItem>
                    <asp:ListItem Value="6">MPV</asp:ListItem>
                    <asp:ListItem Value="7">跑车</asp:ListItem>
                    <asp:ListItem Value="8">商用车</asp:ListItem>
               
                </asp:DropDownList>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <asp:DropDownList ID="ddlmileage" runat="server" >
                    <asp:ListItem Value="-1">行驶里程</asp:ListItem>
               
                    <asp:ListItem Value="1">1万公里以内</asp:ListItem>
                    <asp:ListItem Value="2">3万公里以内</asp:ListItem>
                    <asp:ListItem Value="3">5万公里以内</asp:ListItem>
                    <asp:ListItem Value="4">5万公里以上</asp:ListItem>
               
                </asp:DropDownList>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <asp:DropDownList ID="ddlGearBox" runat="server" >
                    <asp:ListItem Value="-1">变速箱</asp:ListItem>
               
                    <asp:ListItem Value="1">手动</asp:ListItem>
                    <asp:ListItem Value="2">自动</asp:ListItem>
               
                </asp:DropDownList>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <asp:DropDownList ID="ddlOutputVolume" runat="server" >
                    <asp:ListItem Value="-1">排量</asp:ListItem>
               
                    <asp:ListItem Value="1">1.0L以下</asp:ListItem>
                    <asp:ListItem Value="2">1.0-1.6L</asp:ListItem>
                    <asp:ListItem Value="3">1.6-2.0L</asp:ListItem>
                    <asp:ListItem Value="4">1.6-2.0L</asp:ListItem>
                    <asp:ListItem Value="5">2.0-3.0L</asp:ListItem>
                    <asp:ListItem Value="6">3.0L以上</asp:ListItem>
               
                </asp:DropDownList>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <asp:DropDownList ID="ddlDischargeStandard" runat="server" >
                    <asp:ListItem Value="-1">排放标准</asp:ListItem>
               
                    <asp:ListItem Value="1">国2级以上</asp:ListItem>
                    <asp:ListItem Value="2">国三级以上</asp:ListItem>
                    <asp:ListItem Value="3">国四级以上</asp:ListItem>
                    <asp:ListItem Value="4">国5</asp:ListItem>
               
                </asp:DropDownList>
             &nbsp;&nbsp;&nbsp;&nbsp;
                <asp:DropDownList ID="ddlcolor" runat="server" >
                    <asp:ListItem Value="-1">颜色</asp:ListItem>
               
                    <asp:ListItem Value="1">黑色</asp:ListItem>
                    <asp:ListItem Value="2">白色</asp:ListItem>
                    <asp:ListItem Value="3">银灰色</asp:ListItem>
                    <asp:ListItem Value="4">深灰色</asp:ListItem>
                    <asp:ListItem Value="5">红色</asp:ListItem>
                    <asp:ListItem Value="6">橙色</asp:ListItem>
                    <asp:ListItem Value="7">多彩色</asp:ListItem>
                    <asp:ListItem Value="8">绿色</asp:ListItem>
                    <asp:ListItem Value="9">蓝色</asp:ListItem>
                    <asp:ListItem Value="10">咖啡色</asp:ListItem>
                    <asp:ListItem Value="11">紫色</asp:ListItem>
                    <asp:ListItem Value="12">香槟色</asp:ListItem>
                    <asp:ListItem Value="13">黄色</asp:ListItem>
                    <asp:ListItem Value="14">其他</asp:ListItem>
               
                </asp:DropDownList>
             &nbsp;&nbsp;&nbsp;&nbsp;
                <asp:DropDownList ID="ddlcountry" runat="server" >
                    <asp:ListItem Value="-1">国别</asp:ListItem>
               
                    <asp:ListItem Value="1">德系</asp:ListItem>
                    <asp:ListItem Value="2">日系</asp:ListItem>
                    <asp:ListItem Value="3">美系</asp:ListItem>
                    <asp:ListItem Value="4">法系</asp:ListItem>
                    <asp:ListItem Value="5">韩系</asp:ListItem>
                    <asp:ListItem Value="6">自主</asp:ListItem>
                    <asp:ListItem Value="7">其他</asp:ListItem>
               
                </asp:DropDownList>
             &nbsp;<br />
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       &nbsp;开始时间&nbsp; &nbsp;
                <input id="datestart" class="Wdate" runat="server" onfocus="WdatePicker({lang:'zh-cn'})" type="text" />&nbsp; 结束时间
                <input id="dateend" class="Wdate" runat="server" onfocus="WdatePicker({lang:'zh-cn'})" type="text" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <asp:CheckBox ID="cbIsUrgent" runat="server" Text="降价急售" />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <asp:CheckBox ID="cbQuasiNewCar" runat="server" Text="准新车" />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <asp:CheckBox ID="cbWomenCar" runat="server" Text="女车主" />
            &nbsp; <asp:CheckBox ID="cbSevenSeat" runat="server" Text="7座车" />
            &nbsp;&nbsp;
                <asp:CheckBox ID="cbViewdown" runat="server" Text="是否查看下级" Checked="True" />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <asp:Button ID="Btn_Search" runat="server" OnClick="Btn_Search_Click" Text="查找" />
               <br />
        </div>

        <webdiyer:AspNetPager ID="AspNetPager1" runat="server" OnPageChanging="AspNetPager1_PageChanging" ShowCustomInfoSection="Left" ShowNavigationToolTip="True" HorizontalAlign="Right" AlwaysShow="True" CustomInfoHTML="&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;共&lt;font color='red'&gt;%RecordCount%&lt;/font&gt; 条记录,当前页 &amp;nbsp;&amp;nbsp;&lt;font color='red'&gt;%CurrentPageIndex%&lt;/font&gt; of %PageCount%" FirstPageText="第一页" LastPageText="最后一页" NextPageText="下一页" PrevPageText="上一页" ToolTip="Pager Navigation" SubmitButtonClass="AspPagerNext_Button" PageSize="1" Width="95%">
        </webdiyer:AspNetPager>

        <rsweb:ReportViewer ID="ReportViewer1" runat="server" HyperlinkTarget="_blank"     Font-Names="Verdana" Font-Size="8pt" Height="446px" WaitMessageFont-Names="Verdana" WaitMessageFont-Size="14pt" Width="1772px" BorderStyle="None" AsyncRendering="False" DocumentMapWidth="100%" PromptAreaCollapsed="True" SizeToReportContent="True" ZoomMode="PageWidth">
            <LocalReport ReportPath="Report\Orport.rdlc" EnableHyperlinks="true">
       
            </LocalReport>
        </rsweb:ReportViewer>
                   <div style="position:absolute;float:left; display:block; width:100%;">
                    <p>
                <asp:Label ID="Label1" runat="server" Font-Bold="True" ForeColor="#CC0000" Text="&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;合计:"></asp:Label>
                &nbsp;&nbsp;&nbsp;总数:&nbsp;<asp:Label ID="lbltotalCarno" runat="server" Font-Bold="True"></asp:Label>
                &nbsp;成交价格:&nbsp;<asp:Label ID="lbltotalDealprice" runat="server" Font-Bold="True"></asp:Label>
                        &nbsp;&nbsp;物流费用:&nbsp;<asp:Label ID="lbltotalShippingfee" runat="server" Font-Bold="True"></asp:Label>
                &nbsp;&nbsp;&nbsp;服务费:&nbsp;<asp:Label ID="lbltotalservicefee" runat="server" Font-Bold="True"></asp:Label>
                &nbsp;保修费:<asp:Label ID="lbltotalwarrantyCost" runat="server" Font-Bold="True"></asp:Label>
                &nbsp;</p></div>
    </form>
</body>
</html>
