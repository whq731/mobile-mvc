<% var num = 0; %>
<% _.each(recommend_topic_list, function(val, key) { %>
	<li>
		<a href="javascript:void(0);" url="#topic/<%= val.topic_id %>" topic_id="<%= val.topic_id %>" onclick="return false;">
			<dl>
				<% if(num == 0){ %><dt><img src="<%= val.image_icon %>" /></dt><% }else{ %><dt><img class="lazy" src="images/iwant/bg_pic.png" imgsrc="<%= val.image_icon %>" /><% } %>
				</dt>
				<dd>
					<p><%= val.title %></p>
					<span>已产生<%= val.original_count %>条内容</span>
				</dd>
			</dl>
		</a>
	</li>
	<% if(typeof(scrollload) === "boolean" && scrollload){num++;} %>
<% }); %>
