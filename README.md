# input-table

![field load image](https://github.com/ZhangCX0109/input-table/raw/master/imgs/1.png)

####  1.依赖文件：
      bootstrap.js、bootstrap.css、jQuery
      
####  2.使用方法
      (1) 引入inputs-table.js
      (2) 在html中添加一个div
          <div id="input_table"></div>
      (3) js
          var dropMenu = [ '类型', '  摄像机', '  光猫 (ONU)' ];
          var deviceName = ['设备名称' ,['摄像机1','摄像机2'],['光猫1','光猫2']];
          var options = {
              titleArr : [ dropMenu,'插座位置', deviceName, 'IP', 'Port', 'Mac','序列号', '用户名', '密码' ],//表头数组
              isEdit:false,//是否以编辑的模式显示,显示已有数据，并且可编辑
              isDetail : false,//是否以查看的模式显示，用来显示已有数据，不可编辑
              panelTitle : '添加检测项目',//面板的title
              ctrlCol : '类型'//用来指定哪一列的下拉选项用来控制其他下拉选项
          };
          var oldData = [];//格式需要和获取到的表格数据的格式保持一致
          inputTab.initTable($('#input_table'),options,oldData);
          
          inputTab.getResult();//获取表格现有
