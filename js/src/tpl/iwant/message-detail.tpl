<% var num = 0, html = ""; %>
<!-- 
	 type说明
	 type=1006为管理员删除原创内容
	 type=1003为评论
	 type=1004为回复（有to_cust_id就是回复某人，无to_cust_id就是被复）
	 type=1005为赞
	 type=1009为管理员封禁
	 type=1010为管理员删评论
-->
<% _.each(message_list, function(val, key) { %>
	<%
		switch(val.type){
			case "1006":
			case "1009":
			case "1010":
				var img = "";
				if(num == 0){
					img = '<img src="images/iwant/dang.png" alt="" />';
				}else{
					img = '<img class="lazy" src="images/iwant/bg_pic.png" imgsrc="images/iwant/dang.png" alt="" />';
				}
				html += '<li>\
					<dl>\
						<dd>\
							<p class="info">\
								<span class="img">' + img + '</span>\
								<span class="detail">\
									<i>管理员</i>\
									<em>' + val.creation_date + '</em>\
								</span>\
							</p>\
							<p class="text">' + val.msg_content + '</p>\
						</dd>\
					</dl>\
				</li>';
				break;
			case "1003":
				var img = "", original_img = "";
				if(num == 0){
					img = '<img class="img_img" src="' + val.from_head_pic_url + '" alt="" />';
				}else{
					img = '<img class="img_img" class="lazy" src="images/iwant/bg_pic.png" imgsrc="' + val.from_head_pic_url + '" alt="" />';
				}
				if(typeof(val.original_image) !== "undefined" && val.original_image != null && val.original_image != ""){
					if(num == 0){
						original_img = '<dt><a href="javascript:void(0);" topic_id="' + val.id + '" class="topic"><img src="' + val.original_image.small + '" class="topic_img" alt="" /></a></dt>';
					}else{
						original_img = '<dt><a href="javascript:void(0);" topic_id="' + val.id + '" class="topic"><img class="lazy" src="images/iwant/bg_pic.png" class="topic_img" imgsrc="' + val.original_image.small + '" alt="" /></a></dt>';
					}
				}else{
					original_img = "";
				}
				html += '<li class="jump" message_id=' + val.id + ' onclick="return false;">\
					<dl>\
						<dd>\
							<p class="info">\
								<a href="javascript:void(0);" class="img" cust_id="' + val.from_cust_id + '">' + img + '</a>\
								<span class="detail">\
									<a class="name" href="javascript:void(0);" cust_id="' + val.from_cust_id + '">' + val.from_cust_nickname + '</a>\
									<em>' + val.creation_date + '</em>\
								</span>\
							</p>\
							<p class="text">评论：' + val.msg_content + '</p>\
						</dd>' + original_img + '\
					</dl>\
				</li>';
				break;
			case "1004":
				var img = "", original_img = "", reply = "";
				if(num == 0){
					img = '<img class="img_img" src="' + val.from_head_pic_url + '" alt="" />';
				}else{
					img = '<img class="img_img" class="lazy" src="images/iwant/bg_pic.png" imgsrc="' + val.from_head_pic_url + '" alt="" />';
				}
				if(typeof(val.original_image) !== "undefined" && val.original_image != null && val.original_image != ""){
					if(num == 0){
						original_img = '<dt><a href="javascript:void(0);" topic_id="' + val.id + '" class="topic"><img src="' + val.original_image.small + '" class="topic_img" alt="" /></a></dt>';
					}else{
						original_img = '<dt><a href="javascript:void(0);" topic_id="' + val.id + '" class="topic"><img class="lazy" src="images/iwant/bg_pic.png" class="topic_img" imgsrc="' + val.original_image.small + '" alt="" /></a></dt>';
					}
				}else{
					original_img = "";
				}
				if(typeof(val.to_cust_id) !== "undefined" && val.to_cust_id != ""){
					reply = '回复<a class="reply" href="javascript:void(0);" to_cust_id="' + val.to_cust_id + '">' + val.to_cust_nickname + '</a>';
				}else{
					reply += '回复你';
				}
				html += '<li class="jump" message_id=' + val.id + ' onclick="return false;">\
					<dl>\
						<dd>\
							<p class="info">\
								<a href="javascript:void(0);" class="img" cust_id="' + val.from_cust_id + '">' + img + '</a>\
								<span class="detail">\
									<a class="name" href="javascript:void(0);" cust_id="' + val.from_cust_id + '">' + val.from_cust_nickname + '</a>\
									<em>' + val.creation_date + '</em>\
								</span>\
							</p>\
							<p class="text">' + reply + '：' + val.msg_content + '</p>\
						</dd>' + original_img + '\
					</dl>\
				</li>';
				break;
			case "1005":
				var img = "", original_img = "";
				if(num == 0){
					img = '<img class="img_img" src="' + val.from_head_pic_url + '" alt="" />';
				}else{
					img = '<img class="img_img" class="lazy" src="images/iwant/bg_pic.png" imgsrc="' + val.from_head_pic_url + '" alt="" />';
				}
				if(typeof(val.original_image) !== "undefined" && val.original_image != null && val.original_image != ""){
					if(num == 0){
						original_img = '<dt><a href="javascript:void(0);" topic_id="' + val.id + '" class="topic"><img src="' + val.original_image.small + '" class="topic_img" alt="" /></a></dt>';
					}else{
						original_img = '<dt><a href="javascript:void(0);" topic_id="' + val.id + '" class="topic"><img class="lazy" src="images/iwant/bg_pic.png" imgsrc="' + val.original_image.small + '" class="topic_img" alt="" /></a></dt>';
					}
				}else{
					original_img = "";
				}
				html += '<li class="jump" message_id=' + val.id + ' onclick="return false;">\
					<dl>\
						<dd>\
							<p class="info">\
								<a href="javascript:void(0);" class="img" cust_id="' + val.from_cust_id + '">' + img + '</a>\
								<span class="detail">\
									<a class="name" href="javascript:void(0);" cust_id="' + val.from_cust_id + '">' + val.from_cust_nickname + '</a>\
									<em>' + val.creation_date + '</em>\
								</span>\
							</p>\
							<p class="text purple">' + val.msg_content + '</p>\
						</dd>' + original_img + '\
					</dl>\
				</li>';
				break;
		}
	%>
	<% if(typeof(scrollload) === "boolean" && scrollload){num++;} %>
<% }); %>
<%= html %>
