<header>
    <a href="javascript:void(0);" onclick="history.back();" class="goback">返回</a>
    <span class="title">
        <p class="title_wrap">
            <span class="text"><%=nickname %></span>
        </p>
    </span>
    <% if(is_self) { %>
    <a href="#message" class="i_header imessage"></a>
    <% } %>
</header>
