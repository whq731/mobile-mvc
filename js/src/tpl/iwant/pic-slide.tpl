<div id="slide-pic">
    <section class="bg black"></section>
    <section class="big_pic">
        <div class="con">
            <div class="show_area">
                <div class="pic_wrap" style="width:<%=imgData.imgLength %>00%; position: absolute;">
                    <div id="line_height" style="width: 100%; line-height: <%=innerHeight %>px;">
                    <% _.each(imgData.imgList, function(imgSrc, key){ %>
                    <% if(key < imgData.currentPic){ %>
                    <p class="left" style="width:<%=100/imgData.imgLength %>%;">
                    <% }else if (key > imgData.currentPic) { %>
                    <p class="right" style="width:<%=100/imgData.imgLength %>%;">
                    <% } else { %>
                    <p class="center" style="width:<%=100/imgData.imgLength %>%;">
                    <% } %>
                    <img class="img_loading" src="images/iwant/loading.gif" imgsrc="<%=imgSrc %>" alt="" /></p>
                    <% }); %>
                    </div>
                </div>

            </div>
            <div class="dot">
                <ul>
                    <% for(var i=0; i < imgData.imgLength; i++) { %>
                    <% if(i == imgData.currentPic) { %>
                    <li class="on"><a href="javascript:void(0);"></a></li>
                    <% }else{ %>
                    <li><a href="javascript:void(0);"></a></li>
                    <% } %>
                    <% } %>
                </ul>
            </div>
        </div>
    </section>
</div>