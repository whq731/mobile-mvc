<% var all_classname = "", my_classname = ""; %>
<% if(typeof(channel) === "undefined"){channel = ["home"];}%>
<% _.each(channel, function(val, key) { %>
	<% if(val == "topiclist"){all_classname = "";my_classname = "on";}else{all_classname = "on";my_classname = "";} %>
	<a id="all" href="javascript:void(0);" class="<%= all_classname %>">全部话题</a>
	<a id="my" href="javascript:void(0);" class="<%= my_classname %>">我的关注</a>
<% }); %>
