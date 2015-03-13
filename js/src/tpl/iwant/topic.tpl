<section class="act_detail" id="fixed-detail" style="<% if(topic.topic_type==1){ %>display: none;<% } %> position: fixed; top: 48.5px; z-index:6;-webkit-transform: translate3d(0, 0, 0);transform: translate3d(0, 0, 0); -webkit-transition-duration: .25s; transition-duration: .25s;"><%=topic.topic_detail %></section>
<div id="content">
    <section id="doc-detail" <% if(topic.topic_type==1){ %>style="display: none"<% } %> class="act_detail"><%=topic.topic_detail %></section>
    <section <% if(topic.topic_type!=1){ %>style="display: none"<% } %> class="activity_area">
        <span><img src="<%=topic.image_header %>" alt="" /></span>
        <div class="activity_text">
            <dl>
                <dt>
                <h3><%=topic.topic_title %></h3>
                <em>已参与人数<%=topic.follow_num %></em>
                </dt>
                <dd>
                    <% if(topic.concern_status == 0) { %>
                    <a href="javascript:void(0);" class="follow">关注</a>
                    <% } else { %>
                    <a href="javascript:void(0);" class="already follow">已关注</a>
                    <% } %>
                </dd>
            </dl>
            <% if(topic.topic_detail.length <= 35) { %>
            <p><%=topic.topic_detail %></p>
            <% } else { %>
            <p class="shortdetail"><%=topic.topic_detail.substring(0,35)+'...' %></p>
            <p style="display: none;" class="longdetail"><%=topic.topic_detail %></p>
            <% } %>
        </div>
    </section>
</div>
<section class="add">
    <a href="javascript:void(0);">发表评论</a>
</section>