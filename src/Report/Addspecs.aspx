<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Addspecs.aspx.cs" EnableEventValidation="false" Inherits="CTXProject.Web.Report.Addspecs" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
     <link href="CommonStyle.css" rel="stylesheet" />
     <style type="text/css">
        .auto-style1 {
                font-size: large;
             text-align: center;
         }
        .auto-style2 {
            text-align: left;
        }
    </style>

    <script src="JS/Common.js"></script>
    <script src="JS/jquery-1.1.3.1.pack.js"></script>
    <script type="text/javascript">
	jQuery.noConflict();
    </script>
     <script>
        function loadSecondCatalogData(firstCatalogObj_id, secondCatalogObj_id)
        {
            var ajaxUrl = "Brand_Series.aspx";
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
                     var ddlbrandID = "<%=ddlBrand.ClientID%>";
		    
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
		            var objddlbrand = document.getElementById(ddlbrandID);
		            var objddlbrandSelecttxt = objddlbrand.options[objddlbrand.selectedIndex].text;

		            document.getElementById("brandtext").value = objddlbrandSelecttxt
		        //    alert(objddlbrandSelecttxt);
		          

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
            ) 
       }


         function loadThreeCatalogData(firstCatalogObj_id, secondCatalogObj_id, brand_id)
         {
             var ajaxUrl = "Series_Specs.aspx";
            var objFirstCatalogList = $(firstCatalogObj_id);
            var objSecondCatalogList = $(secondCatalogObj_id);
                 // var objBrand = document.getElementById(ddlbrand);
            var objBrand = $(brand_id);
            var lang_DataIsLoading = "加载中......";
            var lang_SelectTopCatalogFirst = "请选择系列";
            var lang_allTopSecondCatalog = "全部";
    
            var data = {
                Action: "GetSpecsListBySeriesID",
                SeriesID: objFirstCatalogList.value.trim(),
                BrandID: objBrand.value.trim()
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
          
                    var childCatalogs = xml.getElementsByTagName("SpecsList")[0].childNodes;
     
		            var txtProvinceID="<%=specstext.ClientID %>";
                    var ddlProvinceID = "<%=ddlspecs.ClientID%>";
                    var ddlSeriesID="<%=ddlseries.ClientID%>";
		    
		            if (childCatalogs.length==0)
		            {
	
		                document.getElementById(txtProvinceID).style.display = "inline";
		            document.getElementById(ddlProvinceID).style.display="None";
		    
		            }
		            else
		            {
		    
		            document.getElementById(txtProvinceID).style.display="None";
		            document.getElementById(ddlProvinceID).style.display = "inline";
		            }

		            var objddlSeriesID = document.getElementById(ddlSeriesID);
		            var objddlSeriesIDSelecttxt = objddlSeriesID.options[objddlSeriesID.selectedIndex].text;

		            document.getElementById("seritext").value = objddlSeriesIDSelecttxt
		        //    alert(objddlSeriesIDSelecttxt);

		            var childCatalog = null;
		            var catalogID = "";
		            var catalogName = "";
		            objSecondCatalogList.length = 0;
		            objSecondCatalogList.options[0] = new Option(lang_allTopSecondCatalog, "");
                    for (var i = 0; i < childCatalogs.length; i++)
                    {
                        childCatalog = childCatalogs[i];
                        catalogID = childCatalog.getAttribute("id");
                        catalogName = childCatalog.firstChild.data;
                        objSecondCatalogList.options[objSecondCatalogList.options.length] = new Option(catalogName, catalogID);
                    }
            
                }
            )     
       }

    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div class="auto-style2">
        <div>
            <h1 class="auto-style1">&nbsp;</h1>
        </div>
        <div>
                &nbsp;&nbsp;&nbsp;&nbsp; 品牌&nbsp;&nbsp;&nbsp;&nbsp;
                <asp:DropDownList ID="ddlBrand"  runat="server" >
                </asp:DropDownList>
                &nbsp;
                系列&nbsp;&nbsp;
                <asp:DropDownList ID="ddlseries" runat="server" >
                    <asp:ListItem Value="-1">全部</asp:ListItem>
               
                </asp:DropDownList>
             <input id="seriestext" runat="server" style="display:none; " type="text" value="全部" />&nbsp;&nbsp;&nbsp;

             &nbsp;
                规格&nbsp;&nbsp;
                <asp:DropDownList ID="ddlspecs" runat="server" >
                    <asp:ListItem Value="-1">全部</asp:ListItem>
                </asp:DropDownList>

             <input id="specstext" runat="server" style="display:none; " type="text" value="全部" />&nbsp;&nbsp;&nbsp;
            <input id="brandtext" runat="server" style="display:none; " type="text" value="全部" />&nbsp;&nbsp;&nbsp;
            <input id="seritext" runat="server" style="display:none; " type="text" value="全部" />&nbsp;&nbsp;&nbsp;
            
                要添加的规格&nbsp;&nbsp;&nbsp;&nbsp;
                <asp:TextBox ID="txSepc" runat="server"></asp:TextBox>
&nbsp;&nbsp;&nbsp;&nbsp;
                <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; 规格参数<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 变速箱&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                <asp:TextBox ID="txGearBox" runat="server">自动</asp:TextBox>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; 环保变准&nbsp; <asp:TextBox ID="txHB" runat="server">国V</asp:TextBox>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; 级别&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <asp:TextBox ID="txJB" runat="server">小型车</asp:TextBox>
                <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; 排量&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <asp:TextBox ID="txPL" runat="server">2.0</asp:TextBox>
                <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 座位个数&nbsp; 
                <asp:TextBox ID="txZW" runat="server">5</asp:TextBox>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; 出厂价格&nbsp; <asp:TextBox ID="txNewPrice" runat="server">98500</asp:TextBox>
&nbsp;&nbsp;&nbsp;元&nbsp;&nbsp;
                <asp:Button ID="btnsm" runat="server" OnClick="btnsm_Click" Text="单独提交规格" />
        </div>
    
    </div>
        品牌&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <asp:DropDownList ID="ddlBrand2"  runat="server" >
                </asp:DropDownList>
                &nbsp;
            </p>
        <p>
            小品牌：&nbsp;&nbsp; &nbsp;<asp:TextBox ID="txCarSeries1" runat="server">一汽-大众奥迪</asp:TextBox>

            &nbsp;</p>
        <p>
            系列类别：&nbsp; &nbsp;<asp:TextBox ID="txCarSeries2" runat="server">奥迪A4L</asp:TextBox>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p>
            系列分类&nbsp;&nbsp;&nbsp; <asp:TextBox ID="txCarSeriesDetail" runat="server">1.8升 涡轮增压 160马力</asp:TextBox>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;</p>
        <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<asp:Button ID="btnsm0" runat="server" OnClick="btnAddCarSeries_Click" Text="单独添加系列" />
        </p>
    </form>
</body>
</html>
