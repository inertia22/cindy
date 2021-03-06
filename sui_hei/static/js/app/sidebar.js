define(["jquery", "velocity-animate"], function($) {
  function ResizeSidebarContent() {
    // Set Height
    var nav_height = 60;
    var chat_height = 60;
    var table_height = goodh - nav_height - chat_height - 5;
    $(".lobby_navigation_div").velocity({ height: nav_height + "px" });
    $(".lobby_chat_div").velocity({ height: nav_height + "px" });
    $(".lobby_table_div").css("height", table_height + "px");

    $("#lobby_chat_input").on("keypress", function(e) {
      if (e.which == 13) {
        $("#lobby_chat_submit").click();
      }
    });

    $(".lobby_table_div").velocity("scroll", {
      offset: $(".lobby_table_div").prop("scrollHeight"),
      container: $(".lobby_table_div"),
      duration: 0
    });
  }

  function ResizeSidebar() {
    var $leftbar = $(".leftbar");
    var $rightbar = $(".rightbar");
    var $leftbarbtn = $(".leftbar_button");
    var $memobarbtn = $(".memobar_button");

    $leftbar.css("width", goodw + "px");
    if ($leftbar.attr("mode") == "open") {
      $leftbar.css("left", "0%");
    } else {
      $leftbar.css("left", -goodw * 0.792 + "px");
      $leftbar.attr("mode", "closed");
    }

    $rightbar.css("width", goodw + "px");
    if ($rightbar.attr("mode") == "open") {
      $rightbar.css("left", windoww - goodw * 0.792 + "px");
    } else {
      $rightbar.css("left", windoww + "px");
      $rightbar.attr("mode", "closed");
    }

    $(".leftbar_content").css("height", goodh + "px");
    $(".memobar_content").css("height", goodh + "px");

    resize_rate = $leftbarbtn.height() / (window.innerHeight * 0.45);
    $leftbarbtn
      .css("height", $leftbarbtn.height() / resize_rate + "px")
      .css("width", $leftbarbtn.width() / resize_rate + "px");

    resize_rate = $memobarbtn.height() / (window.innerHeight * 0.45);
    $memobarbtn
      .css("height", $memobarbtn.height() / resize_rate + "px")
      .css("width", $memobarbtn.width() / resize_rate + "px");
  }

  var goodh, goodw, windoww, small_screen;
  function CalcGoodRect() {
    // Calculate best width & height of sidebar
    goodh = window.innerHeight - 20;
    if (goodh < 400) {
      goodh = window.innerHeight;
    }
    windoww = Math.max(window.outerWidth, window.innerWidth);
    goodw = windoww * 0.45;
    small_screen = false;
    if (goodw < 400) {
      goodw = Math.max(window.outerWidth, window.innerWidth);
      small_screen = true;
    }
  }

  function ToggleSidebar() {
    // Toggle sidebar
    $(".leftbar_button").on("click", function() {
      var $leftbar = $(".leftbar");
      var $rightbar = $(".rightbar");

      if ($leftbar.attr("mode") == "closed") {
        $leftbar.velocity({
          left: "0%",
          duration: 1000
        });
        $leftbar.attr("mode", "open");

        if (small_screen) {
          $rightbar.velocity({
            left: windoww + goodw + "px",
            duration: 1000
          });
          $rightbar.attr("mode", "hide");
        }
      } else if ($leftbar.attr("mode") == "open") {
        $(".leftbar").velocity({
          left: -goodw * 0.792 + "px",
          duration: 1000
        });
        $leftbar.attr("mode", "closed");

        if (small_screen) {
          $rightbar.velocity({
            left: windoww + "px",
            duration: 1000
          });
          $rightbar.attr("mode", "closed");
        }
      }
    });
    $(".rightbar_button").on("click", function() {
      var $this = $(".rightbar");

      if ($this.attr("mode") == "closed") {
        $this.velocity({
          left: windoww - goodw * 0.792 + "px",
          duration: 1000
        });
        $this.attr("mode", "open");

        if (small_screen) {
          $(".leftbar").velocity({
            left: -goodw + "px",
            duration: 1000
          });
          $(".leftbar").attr("mode", "hide");
        }
      } else if ($this.attr("mode") == "open") {
        $(".rightbar").velocity({
          left: windoww + "px",
          duration: 1000
        });
        $this.attr("mode", "closed");

        if (small_screen) {
          $(".leftbar").velocity({
            left: -goodw * 0.792 + "px",
            duration: 1000
          });
          $(".leftbar").attr("mode", "closed");
        }
      }
    });
  }

  function ChangeChannel() {
    OpenChat(jQuery("#lobby_nav_input").val());
    return false;
  }

  function PostChat(channel, message) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    if (!channel.match("^[A-Za-z0-9-]+$")) {
      return false;
    }
    jQuery.post(
      "/lobby/chat",
      {
        csrfmiddlewaretoken: csrftoken,
        channel: channel,
        push_chat: message
      },
      function(data) {
        jQuery(".leftbar_content").html(data);
      }
    );
    return false;
  }

  function InputNorm() {
    var lc = jQuery("#lobby_nav_input");
    lc.val(lc.val().replace(/[^0-9a-zA-Z]+/g, "-"));
  }

  function PrevChatPage() {
    jQuery.get(
      "/lobby/channel",
      {
        chatpage: jQuery("#lobby_nav_prev").val(),
        channel: jQuery("#channel").val()
      },
      function(data) {
        jQuery(".leftbar_content").html(data);
      }
    );
  }

  function NextChatPage() {
    jQuery.get(
      "/lobby/channel",
      {
        chatpage: jQuery("#lobby_nav_next").val(),
        channel: jQuery("#channel").val()
      },
      function(data) {
        jQuery(".leftbar_content").html(data);
      }
    );
  }

  function OpenChat(channel) {
    var $this = $(".leftbar");

    jQuery.get("/lobby/channel", { channel: channel }, function(data) {
      jQuery(".leftbar_content").html(data);
    });

    if ($this.attr("mode") != "open") {
      $this.velocity({
        left: "0%",
        duration: 1000
      });
      $this.attr("mode", "open");
      if (small_screen) {
        $(".rightbar").velocity({
          left: windoww + goodw + "px"
        });
        $(".rightbar").attr("mode", "hide");
      }
    }
  }

  return {
    CalcGoodRect: CalcGoodRect,
    ResizeSidebar: ResizeSidebar,
    ResizeSidebarContent: ResizeSidebarContent,
    ToggleSidebar: ToggleSidebar,
    InputNorm: InputNorm,
    NextChatPage: NextChatPage,
    PrevChatPage: PrevChatPage,
    ChangeChannel: ChangeChannel,
    OpenChat: OpenChat,
    PostChat: PostChat
  };
});
