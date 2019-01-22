$(".pop")
    .on("mouseenter", function () {
        var _this = this;
        $(this).popover("show");
        $(".popover").on("mouseleave", function () {
            $(_this).popover('hide');
        });
    })
    .on("mouseleave", function () {
        var _this = this;
       
            if (!$(".popover:hover").length) {
                $(_this).popover("hide");
            }
      
});