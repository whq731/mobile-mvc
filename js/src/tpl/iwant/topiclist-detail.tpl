<% var num = 0; %>
<% _.each(result_list, function(val, key) { %>
	<li>
		<a class="detail" href="javascript:void(0);" url="#topic/<%= val.topic_id %>" topic_id="<%= val.topic_id %>" onclick="return false;">
			<dl>
				<% if(num == 0){ %><dt><img src="<%= val.image_icon %>" /></dt><% }else{ %><dt><img class="lazy" src="images/iwant/bg_pic.png"  imgsrc="<%= val.image_icon %>" /></dt><% } %>
				<dd>
					<p><%= val.title %></p>
					<% var count=""; %>
					<% if(val.new_original_count > 99){count="99+";}else{if(val.new_original_count > 0){count=val.new_original_count;}} %>
					<span><%= count %></span>
				</dd>
			</dl>
		</a>
	</li>
	<% if(typeof(scrollload) === "boolean" && scrollload){num++;} %>
<% }); %>
