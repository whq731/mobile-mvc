<div class="act_list_wrap">
    <div class="title_wrap">
        <dl class="title_container">
            <dt><a onclick="return false;" href="#me/<%=cust_id %>"><img src="<%=head_pic_url %>" alt=""></a></dt>
            <dd>
                <dl class="title_detail">
                    <dt><a onclick="return false;" href="#me/<%=cust_id %>" style="color: black;"><%=nick_name %></a></dt>
                    <dd><%=creation_date %></dd>
                </dl>
            </dd>
        </dl>
    </div>
    <div class="content">
		<%
			var text = content,
				search_url = "search://key=";
			if(content_tags.length > 0){
				var unique = function(arr){
					// 去重
					var res = [],
						json = {};
					for(var i = 0; i < arr.length; i++){
						if(!json[arr[i]]){
							res.push(arr[i]);
							json[arr[i]] = 1;
						}
					}
					return res;
				}
				content_tags = unique(content_tags);
				for(var i = 0; i < content_tags.length; i++){
					var search_text = encodeURIComponent($.trim(content_tags[i].replace(/#/g, ""))),
						replace_reg = new RegExp(content_tags[i], "g");
						replace_url = "<a class='user_label' href='" + search_url + search_text + "'>" + content_tags[i] + "</a>";
					text = text.replace(replace_reg, replace_url);
				}
			}
		%>
        <h2><%= text %></h2>
        <% if(!_.isEmpty(image_list)) { %>
		<% var one = ""; %>
		<% if(image_list.length == 1){one = " only_one";} %>
        <ul class="pic<%= one %>">
        <% _.each(image_list, function(value, key){ %>
            <li class="onepic" data-key="<%=key %>" bigsrc="<%=value['big'] %>"><a href="javascript:void(0);"><img src="<%=value['small'] %>" alt=""></a></li>
        <% }); %>
        </ul>
        <% } %>
        <% if(tag_list.length>0) { %>
        <p class="label">
            <% _.each(tag_list, function(value){ %>
            <% var url = search_link.replace('{%key%}', encodeURIComponent(value)).replace('{%cid%}', '0'); %>
            <a href="<%=url %>">#<%=value %>#</a>
            <% }); %>
        </p>
        <% } %>
        <div id="comment_detail_<%=original_id %>"></div>
    </div>
</div>
