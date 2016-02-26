angular.module('chetongxiang.filters', []).
    filter('OrderStatus', function() {
        return function(status) {
            //订单状态
            status = status + "";
            var descr = "";
            switch (status) {
                case "0":
                    descr = "支付预付款";
                    break;
                case "1":
                    descr = "预付款审核";
                    break;
                case "2":
                    descr = "评估检测";
                    break;
                case "3":
                    descr = "确定物流费";
                    break;
                case "4":
                    descr = "支付购车款";
                    break;
                case "5":
                    descr = "购车款审核";
                    break;
                case "6":
                    descr = "物流发车";
                    break;
                case "7":
                    descr = "确认到车";
                    break;
                case "8":
                    descr = "评估检测";
                    break;
                case "9":
                    descr = "客户提车";
                    break;
                case "10":
                    descr = "已完成(未评价)";
                    break;
                case "256":
                    descr = "已完成(买家已评)";
                    break;
                case "257":
                    descr = "已完成(车主已评)";
                    break;
                case "255":
                    descr = "已完成(双方已评)";
                    break;
                default:
                    descr = "";
                    break;

            }
            return descr;
        }
    }).filter('CarStatus', function() {
        //
        return function(status) {
            status = status + ""
            var descr = "";
            switch (status) {
                case "0":
                    descr = "显示中";
                    break;
                case "1":
                    descr = "交易中";
                    break;
                case "254":
                    descr = "已下架";
                    break;
                case "255":
                    descr = "交易完成";
                    break;
                default:
                    descr = "未知：" + status;
                    break;

            }
            return descr;
        }
    }).filter('CarCheckStatus', function() {
        //车辆状态
        return function(status) {
            status = status + ""
            var descr = "";
            switch (status) {
                case "0":
                    descr = "未审核";
                    break;
                case "1":
                    descr = "初审不通过";
                    break;
                case "2":
                    descr = "已初审";
                    break;
                case "3":
                    descr = "终审不通过";
                    break;
                case "4":
                    descr = "终审通过";
                    break;
                default:
                    descr = "未知：" + status;
                    break;

            }
            return descr;
        }
    }).filter('ApprOrderStatus', function() {
        //评估检测状态
        return function(status) {
            status = status + "";
            var descr = "";
            switch (status) {
                case "0":
                    descr = "未付款";
                    break;
                case "1":
                    descr = "已付款待接单";
                    break;
                case "2":
                    descr = "待评估";
                    break;
                case "3":
                    descr = "已评估待评估师评价";
                    break;
                case "4":
                    descr = "评估师已评价待用户评价";
                    break;
                case "5":
                    descr = "客户已评价";
                    break;
                case "6":
                    descr = "订单完成";
                    break;
                case "255":
                    descr = "订单完成";
                    break;
                default:
                    descr = "未知：" + status;
                    break;

            }
            return descr;
        }
    }).filter('DateFormat',function(){
        return function (date,format){
            if(date){
                var d=new Date(date);
                return d.Format(format);
            }
            return "未知"
        }
    });
