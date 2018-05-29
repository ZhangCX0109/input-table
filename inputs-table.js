inputTab = ( function() {
    var $ = jQuery;
    var options;
    var data = [];
    var isEditing = false;//判断是否是修改按钮
    //初始化
    function init(ele, options) {
        //添加按钮
        addBtnClick = function (ele) {
            isEditing = false;
            $(ele).css({
            	"visibility" : "hidden"
            });
            $('#input-table').append(initInputGroup(options.titleArr));
            $('#input-group').find('a').each(function (index, value) {
                $(value).click(function () {
                    $(value).parent().parent().parent().find('input').val($(value).text());
                })
            })
        };
        //取消按钮
        cancelBtnClick = function (ele) {
        	$('#btn_add_obj').css({
            	"visibility" : "visible"
            });
           // $('#btn_add').prop("disabled",false);
            $(ele).parent().parent().remove('#input-group');
        };
        //确定按钮
        okBtnClick = function (ele) {
            flag = true;
            node = {};
            $(options.titleArr).each(function (index, value) {
                if(value instanceof Array){
                    inputStr = $('#'+'input_'+value[0]).val();
                    if(inputStr.length <= 0){
                        layer.msg('请检查输入是否完全');
                        flag = false;
                        return false;
                    }
                    flag = true;
                    node[''+ value[0] +''] = inputStr;
                }else{
                    inputStr = $('#'+'input_'+value).val();
                    if(inputStr.length <= 0){
                    	layer.msg('请检查输入是否完全');
                        flag = false;
                        return false;
                    }
                    flag = true;
                    node[''+ value +''] = inputStr;
                }
            });
            if (flag){
                node.lineNum = data.length;
                data.push(node);
                $('#btn_add_obj').css({
                	"visibility" : "visible"
                });
                $(ele).parent().parent().remove('#input-group');
                $('#input-table').append(initTD(options.titleArr,node,data.length))
            }
        };
        //编辑按钮
        editBtnClick = function (ele) {
            isEditing = true;
            deleteBtnClick(ele);
            $('#btn_add_obj').css({
            	"visibility" : "hidden"
            });
            idx = $(ele).val().split('_').pop();
            lineId = 'line_' + idx;
            $('#input-table').append(initInputGroup(options.titleArr,data[idx-1]));
            $('#input-group').find('a').each(function (index, value) {
                $(value).click(function () {
                    $(value).parent().parent().parent().find('input').val($(value).text());
                })
            })
        };
        //删除按钮
        deleteBtnClick = function (ele) {
                idx = $(ele).val().split('_').pop();
                lineId = 'line_' + idx;
                $(ele).parent().parent().remove('#'+lineId);
                data[idx-1]['delete'] = 'delete';

        };
        //弹框
        initAlertView = function (ele) {
            $.zcxAlert.popUp('确定删除该项目吗?',function(){
                deleteBtnClick(ele);
            })

        };
        //当分类/类型选择时事件
        typeChanged = function(ele) {
            //取消当前行
            $('#input-group').remove();

            var type = $(ele).attr('data-type');

            //在这里根据type更改titleArr
            var tempArr = options.titleArr.slice(0);
            $(tempArr).each(function (index, value) {
               if(value instanceof Array){
                   if(value[0] != options.ctrlCol){
                       console.log(options.titleArr.slice(0));
                           if(value[type][0] != value[0]){
                               value[type].splice(0,0,value[0]);
                           }
                       tempArr[index] = value[type];
                   }
               }
            });
            isEditing = false;
            //重新生成输入的行
            $('#input-table').append(initInputGroup(tempArr));
            $('#input-group').find('a').each(function (index, value) {
                if(($(value).attr('onclick') == undefined)){
                    $(value).click(function () {
                        $(value).parent().parent().parent().find('input').val($(value).text());
                    })
                }else{
                    $(value).parent().parent().parent().find('input').val($(ele).html());
                    return true;
                }

            })
        };
        //创建table和penal
        $(ele).addClass('panel panel-default');
        if(!options.isDetail){
            $(ele).append('<div class="panel-heading">'+ options.panelTitle +'\n' +
                '        <button id="btn_add_obj" type="button" onclick="addBtnClick(this)">添加</button>\n' +
                '    </div>\n' +
                '    <table id="input-table" class="table table-bordered">\n' +
                '        <tr></tr>\n' +
                '    </table>')
        }else{
            $(ele).append('<div class="panel-heading">已有检测项目\n' +
                '    </div>\n' +
                '    <table id="input-table" class="table table-bordered">\n' +
                '        <tr></tr>\n' +
                '    </table>')
        }
        //根据数据创建表头
        $(options.titleArr).each(function (index, value) {
            if (value instanceof Array){
                $('#input-table').find('tr').append('<th>'+ value[0] +'</th>');
            }else{
                $('#input-table').find('tr').append('<th>'+ value +'</th>');
            }

        });
        if(!options.isDetail){
            $('#input-table').find('tr').append('<th>操作</th>');
        }
    }
    //初始化输入框组，添加输入状态的行
    function initInputGroup(titleArr,editNode) {
        // console.log(titleArr);
        // console.log(editNode);
        var tr = '<tr id="input-group">';
        $(titleArr).each(function (index, value) {
            if(value instanceof Array){
                tr += '<td>' + initDropMenu(value,editNode,value) + '</td>'
            }else{
                if(!isEditing){
                    tr += '<td><input style="border: none;text-align: center;width: 100%;" id="input_'+ value +'" placeholder="请输入'+ value +'"/></td>'
                }else{
                    tr += '<td><input value="'+ editNode[value] +'" style="border: none;text-align: center;width: 100%;" id="input_'+ value +'" placeholder="请输入'+ value +'"/></td>'
                }
               // tr += '<td><input style="border: none;text-align: center;width: 100%;" id="input_'+ value +'" placeholder="请输入'+ value +'"/></td>'
            }
        });
        if(isEditing){
            tr += '<td style="text-align: center;width:100px;"><button id="btn_ok" onclick="okBtnClick(this)">确定</button></td>';
        }else{
            tr += '<td style="text-align: center;padding-left:0;padding-right:0;width:100px;"><div style="width: 100px;height: 0;"></div><button style="margin-right: 2px" id="btn_cancel" onclick="cancelBtnClick(this)">取消</button><button id="btn_ok" onclick="okBtnClick(this)">确定</button></td>';
        }
        tr += '</tr>';
        return tr;
    }
    //在有旧数据需要显示的情况下初始化table的td（单行）
    function initTD(titleArr,node,lineNum) {
        var tr = '';
        var currNode = {};
        if (options.isEdit || options.isDetail){
            tr = '<tr id="line_'+ lineNum +'">';
            currNode = node;
        }else{
            tr = '<tr id="line_'+ data.length +'">';
            currNode = data[data.length - 1];
        }
        $(titleArr).each(function (index, value) {
        	//
            if(value instanceof Array){
                tr += '<td><input readonly="true" style="border: none;text-align: center;width: 100%;" value="'+ currNode[''+ value[0] +''] +'"/></td>'
            }else{
                tr += '<td><input readonly="true" style="border: none;text-align: center;width: 100%;" value="'+ currNode[''+ value +''] +'"/></td>'
            }
        });
        if(!options.isDetail && !options.isEdit){
            tr += '<td style="text-align: center;width:100px;padding-left: 2px;padding-right: 0"><button style="" value="editBtn_'+ data.length +'" onclick="editBtnClick(this)">修改</button>' +
                '<button value="deleteBtn_'+ data.length +'" onclick="initAlertView(this)">删除</button></td>';
        }else if(options.isEdit){
            tr += '<td style="text-align: center;width:100px;padding-left: 2px;padding-right: 0"><button style="" value="editBtn_'+ lineNum +'" onclick="editBtnClick(this)">修改</button>' +
                '<button value="deleteBtn_'+ lineNum +'" onclick="initAlertView(this)">删除</button></td>';
        }
        tr += '</tr>';
        return tr;
    }
    //设置css
    function setCSS() {
        $('th').css({'text-align' : 'center'});
    }
    //初始化下拉菜单
    function initDropMenu(dataArr,editNode,val) {
        menu = '<div class="dropdown">';
        if (!isEditing){
            menu += '<input readonly="true" placeholder="请选择'+ dataArr[0] +'" style="border: none;text-align: center;width: 75%;" id="input_'+ dataArr[0] +'" class="dropdown-toggle" data-toggle="dropdown">'
        }else{
            menu += '<input readonly="true" value="'+ editNode[dataArr[0]] +'" placeholder="请选择'+ dataArr[0] +'" style="border: none;text-align: center;width: 75%;" id="input_'+ dataArr[0] +'" class="dropdown-toggle" data-toggle="dropdown">'
        }
        menu += '<span class="caret"></span>' +
            '<ul id="dropdown_menu" class="dropdown-menu dropdown-menu-left" style="width: 100%;">';
        $(dataArr).each(function (index, value) {
           if (index >= 1){
               if(val[0] == options.ctrlCol){
                   menu += '<li><a data-type="'+ index +'" href="#/" onclick="typeChanged(this)">'+ value +'</a></li>'
               }else{
                   menu += '<li><a data-type="'+ index +'" href="#/">'+ value +'</a></li>'
               }
           }
        });
        menu += '<ul/></td>';
        return menu;
    }

    return {
        initTable: function (ele, opt, oldData) {
            options = opt;
            //对表格按钮进行功能划分，并添加表头
            init(ele,options);
            if (opt.isEdit || opt.isDetail){
                data = oldData;
                //便利数据生成表体
                $(data).each(function (index, value) {
                	//根据每行的数据生成表体并添加到input-table里
                    $('#input-table').append(initTD(opt.titleArr,value,index + 1));
                });
            }
            setCSS();
        },
        getResult : function () {
            result = [];
            $(data).each(function (index, value) {
                if (value['delete'] !== 'delete'){
                    result.push(value);
                }
            });
            return result;
        }
    };

} () );