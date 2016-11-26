$(function() {
  $('#q').keyup(function() {
    var query = $('#q').val() || "";
    query = query.trim();
    if (!query) {
      return; // typing한 내용이 없으면 종료
    }

    // spinner를 돌리자..
    $('.form').addClass('loading');

    $.ajax({
      url: '/suggest',
      data: {q: query},
      success: function(data) { // 성공하면 실행되는 부분
        // Ajax의 결과를 잘 받았을 때
        // 화면에 받은 결과를 가지고 list를 rendering하고..
        var els = _.map(data, function(name) { // map은 array를 받아서 array를 돌려주는 것
          return '<li>' + name + '</li>';       // _.으로 실행되는 것들은 underscore.js == lodash.js 같은 라이브러리로 통합
        });
        $('.suggest-box').html(els.join('\n')).show(); // join은 array를 하나의 string으로 변환하는 친구

        // li item을 클릭했을 때, text box의 내용을 바꾸고, suggest-box감춤
        $('.suggest-box li').click(function(e) {
          $('#q').val($(e.currentTarget).text()); // q에 value를 현재 타겟의 텍스트로 바꿔라
          $('.suggest-box').hide();
        });
      },
      complete: function() { // 성공 유무와 상관없이 실행됨
        $('.form').removeClass('loading');  // spinner를 정지
      }
    });
  });
});
