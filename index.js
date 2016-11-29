(function(){
  var OPENCLASS = 'open';//サイドメニューが開いているときにのみサイドメニューへ付与されるクラス名
  var LEFTVALUE = '90%';//サイドメニューがウィンドウの左側何%を陣取るかの値
  var ANIMATINOSPEED = 300;//アニメーションにかかる時間。0.3秒
  var resizeTimer = false;//リサイズ処理を大量に行わないために使用する変数
  var scrollTop = 0;//スクロール量を保存しておく変数
  
  /**
   * メニューバーの高さ（height）を設定するための関数
   * 一番最初と、画面のリサイズが起こった際に使用
   * 画面の高さをwindow.innerHeightで取得することでiosのメニューバー分も含めた高さを取得できる
   * 60を引いているのはheader部分の高さを引いているため。すでにtopには60pxが適用されている
   */
  function sizing(){
    var wh = window.innerHeight;
    $('#menu, #curtain').css({
      'height': wh - 60
    });
  }
  
  /**
   * メニュー開閉をする関数
   * これを呼ぶことで特に今の状態を気にすることなくメニューの開閉ができる
   * メニューが出ている、引っ込んでいるという判断は#menuが.openを持っているかどうか
   * ボタンを押した時の些細なアニメーションとして、一瞬だけボタンのmargin-topを変化させている
   * 
   */
  function menuAction(){
    var btn = $('#menuBtn');//メニューボタン
    var menu = $('#menu');//メニュー本体
    var curtain = $('#curtain');//メニューの後ろに引かれる黒い幕
    //ボタンアニメーション
    btn.css({
      'margin-top': 2
    });
    
    //ボタンアニメーション
    setTimeout(function(){
      btn.css({
        'margin-top': ''
      });
    }, 100);
    
    //メニュー開閉
    if(menu.hasClass(OPENCLASS)){//openクラスを持っているので、閉じる動作をする
      //openクラス削除
      menu.removeClass(OPENCLASS);
      
      //メニューを画面外へ戻すアニメーション
      menu.animate({
        'left': '-' + LEFTVALUE
      }, ANIMATINOSPEED);
      
      //背景の黒い幕を消すアニメーション
      curtain.animate({
        opacity: 'hide'
      }, ANIMATINOSPEED);
      
      //ボタンのテキストを「Menu」に戻す
      btn.text('Menu');
      
      //処理発動から0.2秒後にbodyタグのpositionをrelativeに戻し、元のスクロール位置に帰還
      setTimeout(function(){
        $('body').css({
          'position': 'relative'
        })
        $(window).scrollTop(scrollTop);
      }, 200);
    }
    else{//openクラスを持っているので、開く動作をする
      //openクラス追加
      menu.addClass(OPENCLASS);
      
      //画面外にあったメニューを引っ張り出すアニメーション
      menu.animate({
        'left': 0
      }, ANIMATINOSPEED);
      
      //display: none;で消していた背景の黒幕を出現させるアニメーション
      curtain.animate({
        opacity: 'show'
      }, ANIMATINOSPEED);
      
      //ボタンのテキストを「Close」に変更
      btn.text('Close');
      
      //メニューバーを開いた瞬間のスクロール位置を変数に保存
      scrollTop = $(window).scrollTop();
      
      //position: fixed;でbodyのスクロールを禁止。スクロール位置もそのままで固定
      $('body').css({
        'position': 'fixed',
        'top': -scrollTop
      });
    }
  }
  $(function(){
    //画面の読みこみが終わったらメニューバーの高さ（height）を設定
    sizing();
    
    //ウィンドウのリサイズ（主にスマートフォンの向き回転）に対応する処理
    $(window).resize(function(){
      if(resizeTimer){//resizeTimerに後述のタイマーが入っている場合はtrue扱いになる
        //タイマーにセットされている処理をキャンセルする
        clearTimeout(resizeTimer);
      }
      
      //リサイズするたびにresizeTimerへ処理が予約される
      resizeTimer = setTimeout(function(){
        //画面リサイズ
        sizing();
      }, 200);
    });
    
    //メニューボタンを押して、メニューを開閉する
    $('#menuBtn').click(function(){
      menuAction();
    });
    
    //背景の黒い幕に触れた瞬間、メニューを閉じる（スマートフォン専用）
    $('#curtain').on('touchstart', function(){
      menuAction();
    });
    
    //背景の黒い幕に触れた瞬間、メニューを閉じる（PC用）
    $('#curtain').click(function(){
      menuAction();
    });
  });
}());