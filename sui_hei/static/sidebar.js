$(document).ready(function() {
  $(".leftbar").on("click", function() {
    var $this = $(this);

    // Toggle leftbar
    if ($this.attr("mode") == "closed") {
      $this.velocity({
        left: "0px"
      });
      $this.attr("mode", "opened");
    } else if ($this.attr("mode") == "opened") {
      $(".leftbar").velocity({
        left: "-480px"
      });
      $this.attr("mode", "closed");
    }
  });
});