<header>
    <a href="javascript:void(0);" onclick="history.back();" class="goback">返回</a>
		<span class="title">
			<p class="title_wrap">
                <span class="text"><%=topic_title %></span>
                <% if(concern_status==0) { %>
                <a href="javascript:void(0);" class="status"><span>话题关注</span></a>
                <% } else { %>
                <a href="javascript:void(0);" class="status on"><span>已关注</span></a>
                <% } %>
            </p>
			<!-- hide为向上箭头 -->
			<a href="javascript:void(0);" class="arrow_header">详情</a>
		</span>
    <a href="javascript:void(0);" class="my_header"></a>
</header>
