<div id="content">
<section class="act_detail_title">
    <span><a href="#topic/<%= topic_id %>" onclick="return false;"><img src="<%=topic_image_icon %>" alt="" /></a></span>
    <p><a href="#topic/<%= topic_id %>" onclick="return false;"><%=topic_title %></a></p>
</section>
<section class="act_list">
    <div class="act_list_wrap original_id_<%=original_id %>">
        <div class="title_wrap">
            <dl class="title_container">
                <dt><a href="#me/<%=cust_id %>"><img src="<%=head_pic_url %>" alt="" /></a></dt>
                <dd>
                    <dl class="title_detail">
                        <dt><a href="#me/<%=cust_id %>" style="color: black;"><%=cust_nickname %></a></dt>
                        <dd><%=creation_date %></dd>
                    </dl>
                </dd>
            </dl>
        </div>
        <div class="content">
            <% if(is_delete == 1) { %>
            <div class="deleted"></div>
            <% } else { %>
            <h2><%=original_content %></h2>
            <% if(!_.isEmpty(image_list)) { %>
            <ul class="pic">
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
            <% } %>
            <div id="comment_detail_<%=original_id %>"></div>
        </div>
    </div>
</section>
</div>
