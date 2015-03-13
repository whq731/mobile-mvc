<% var len = active_topic_list.length, w = 1 / len * 100, classname = ""; %>
<div class="content" style="width:<%= len%>00%;">
	<% _.each(active_topic_list, function(val, key) { %>
		<a href="#topic/<%= val.topic_id %>" topic_id="<%= val.topic_id %>" style="width:<%= w %>%;"><img src="<%= val.image_header %>" alt=""></a>
	<% }); %>
</div>
<% if(len > 1){ %>
	<div class="dot">
		<ul>
			<% for(var i = 0; i < len; i++){ %>
				<% if(i == 0){classname = "on";}else{classname = "";} %>
				<li class="<%= classname %>"><a href="javascript:void(0);"></a></li>
			<% } %>
		</ul>
	</div>
<% } %>
