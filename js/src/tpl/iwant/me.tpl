<div id="content">
    <section class="i_detail">
        <dl>
            <dt><img src="<%=user_info.head_pic_url%>" alt=""></dt>
            <dd>
                <p>关注<em><%=user_info.concern_count %></em>被赞<em><%=user_info.praised_count%></em></p>
                <%if(user_info.join_date){ %>
                <span><%=user_info.join_date %>加入</span>
                <% }%>
            </dd>
        </dl>
    </section>
</div>