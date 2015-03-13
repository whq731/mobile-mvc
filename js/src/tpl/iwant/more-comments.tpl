<% _.each(review_list, function(comment, key){ %>
    <% if(comment.type == 0) { %>
    <p class="reply_comment"><a href="#me/<%= comment.from_cust_id%>" onclick="return false;" data-from-cust-id=<%= comment.from_cust_id%>  data-review-id=<%= comment.id%>  data-self=<%= comment.is_self%> class="link"><%= comment.from_cust_nickname%></a>：<%= comment.content%>
    </p>
    <% } else { %>
    <p class="reply_comment"><a href="#me/<%= comment.from_cust_id%>" onclick="return false;" data-from-cust-id=<%= comment.from_cust_id%>  data-review-id=<%= comment.id%>  data-self=<%= comment.is_self%> class="link"><%= comment.from_cust_nickname%></a>回复<a href="#me/<%= comment.to_cust_id%>" class="link"><%= comment.to_cust_nickname%></a>：<%= comment.content%>
    </p>
    <% } %>
<% }); %>