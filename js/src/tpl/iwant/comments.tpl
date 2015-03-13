<div class="control">
    <a href="javascript:void(0)" class="praise border">赞</a>
    <a href="javascript:void(0)" class="comment">评论</a>
    <% if(topic_detail_info.canShare == true) { %>
        <a href="javascript:void(0)" class="enter">进入</a>
    <% } %>
    <div class="clear"></div>
    <div class="comment_detail">
        <h2><div class="border_bg"><span class="praise_count"><%= Number(topic_detail_info.praise_count) %></span>次赞</div></h2>
        <%if(topic_detail_info.review_list && topic_detail_info.review_list.length >0){%>
            <div class="detail">
                <% _.each(topic_detail_info.review_list, function(comment, key){ %>
                    <% if(key <= 4){%>
                        <% if(comment.type == 0) { %>
                        <p class="reply_comment"><a href="#me/<%= comment.from_cust_id%>" onclick="return false;" data-from-cust-id=<%= comment.from_cust_id%>  data-review-id=<%= comment.id%> data-self=<%= comment.is_self%> class="link"><%= comment.from_cust_nickname%></a>：<%= comment.content%>
                        </p>
                        <% } else { %>
                        <p class="reply_comment"><a href="#me/<%= comment.from_cust_id%>" onclick="return false;" data-from-cust-id=<%= comment.from_cust_id%>  data-review-id=<%= comment.id%> data-self=<%= comment.is_self%> class="link"><%= comment.from_cust_nickname%></a>回复<a href="#me/<%= comment.to_cust_id%>" class="link"><%= comment.to_cust_nickname%></a>：<%= comment.content%>
                        </p>
                        <% } %>
                     <% } else {%>
                        <% if(comment.type == 0) { %>
                            <p class="reply_comment hide_comments" style="display:none;" ><a href="#me/<%= comment.from_cust_id%>" onclick="return false;" data-from-cust-id=<%= comment.from_cust_id%>  data-review-id=<%= comment.id%> data-self=<%= comment.is_self%> class="link"><%= comment.from_cust_nickname%></a>：<%= comment.content%>
                            </p>
                            <% } else { %>
                            <p class="reply_comment hide_comments" style="display:none;"><a href="#me/<%= comment.from_cust_id%>" onclick="return false;" data-from-cust-id=<%= comment.from_cust_id%>  data-review-id=<%= comment.id%> data-self=<%= comment.is_self%> class="link"><%= comment.from_cust_nickname%></a>回复<a href="#me/<%= comment.to_cust_id%>" class="link"><%= comment.to_cust_nickname%></a>：<%= comment.content%>
                            </p>
                            <% } %>

                      <% }%>
                <% }); %>
            </div>
        <%} else {%>
            <div class="detail empty"></div>
        <% } %>
        <%if(topic_detail_info.review_list && topic_detail_info.review_list.length <= 5){%>
            <a class="more" data-page=2 style="display:none">查看更多评论...</a>
        <%} else if(topic_detail_info.review_list && 5 < topic_detail_info.review_list.length && topic_detail_info.review_list.length <=10){%>

            <a class="more" data-page=2>查看更多评论...</a>
        <% } %>
        <div class="decorate_arrow"></div>
    </div>
</div>
