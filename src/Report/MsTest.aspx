<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MsTest.aspx.cs" Inherits="CTXProject.Web.Report.MsTest" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
<form action="https://ipay.cmbc.com.cn:9012/gwpay/payServlet" id="form_query" method="post">
oid_partner:<input runat="server" type="text" name="oid_partner" id="oid_partner"  value="GWP_CTX"/><br/>
user_id:<input runat="server" type="text" name="user_id"  id="user_id" value="1"/><br/>
no_order:<input runat="server" type="text" name="no_order" id="no_order" value="1161"/><br/>
dt_order:<input runat="server" type="text" name="dt_order" id="dt_order" value="20160215120224"/><br/>
name_goods:<input runat="server" type="text" name="name_goods"  id="name_goods" value="1"/><br/>
info_order:<input runat="server" type="text" name="info_order" id="info_order" value="1"/><br/>
money_order:<input runat="server" type="text" name="money_order" id="money_order" value="1"/><br/>
notify_url:<input runat="server" type="text" name="notify_url" id="notify_url" value="http://www.chetongxiang.com/Common/MSpay/BGnotify"/><br/>
url_return:<input runat="server" type="text" name="url_return" id="url_return" value="http://www.chetongxiang.com/"/><br/>
url_order:<input runat="server" type="text" name="url_order" id="url_order" value="http://www.chetongxiang.com/admin/index.html#/myentrustlist"/><br/>
bank_code:<input runat="server" type="text" name="bank_code" id="bank_code" value="01020000"/><br/>
pay_type:<input runat="server" type="text" name="pay_type" id="pay_type" value="1"/><br/>
sign:<input runat="server" type="text" name="sign" id="sign" value="nYclvJdc45aSYD++BBARb2I6FCaJ6oD76wxKp60kU/DlZ9+ayEuRu0HHIOSIf112utlVrNY6gpe36rQYM/7LDNkjFNwqm7Hb8WKfkE2e/jP3UEKD7oX56hBsTTa6AtUMlX/uotJ0wT2SLlF7nLhR4Qi+L+S8YOaWGsv7RtGOSSTJaSUO/S/JR9BxXTh2zJZdDRcqaxUNZopcQ7ZsAOgNH09gf8IXF3eRg3Ntt1zJzSS+sc1dgCsj4DSNDeN3baohEvGrWhRWwqYnRuXJL+nGbUiM3ux0QXYOwytscoIsFunzb1N8yy3wgVPz/HappnuBZPr98eygPDOESr0aasLHQg=="/><br/>
<input type="submit" value = "支付" id="button_pay"/>
    </form>
</body>
</html>
