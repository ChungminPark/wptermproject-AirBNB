/*global $:false */
/*global _:false */
/*jslint browser:true, devel: true */
var TaskController = function() { // 클로저를 이용. 내부 함수들을 전역으로 하지 않고 익명의 함수 내부에 넣어놓았기 때문에 마치 private처럼 다른 사람이 건드릴 수 없게 함.
  function setAjaxHandler() {
    $( document ).ajaxStart(function() { // ajaxStart: ajax함수, ajax가 시작할때 class 이름에 loading add
      $("#main").addClass("loading");
    }).ajaxStop(function() { // ajax가 끝날때 loading remove
      $("#main").removeClass("loading");
    });
  }

  function checked(type, value) {
    var e = $("." + type + " .option[data-value='" + value + "']");
    return e.hasClass('selected');
  }

  var Constructor = function () {
    var self = this;
    setAjaxHandler();
    this.taskTemplate = _.template($("#task-template").html()); // _의 템플릿 기능을 사용하여, 템플릿을 미리 만들어줌. 데이터만 주면 이제 string이 나옴.
    this.load(); // load는 하단에 prototype에 선언되어있음
    $("#search-home").click(function() {
      self.postTask();
    }.bind(this));
    $("section.options a.option")
    .addClass('selected')
    .click(function(e) {
      $(e.currentTarget).toggleClass('selected');
      self.render();
    });

    $("section.options a.all").click(function(e) {
      var section = $($(e.currentTarget).closest('section'));
      var options = section.find('.option');
      if (options.length === section.find('.option.selected').length) {
        options.removeClass('selected');
      } else {
        options.addClass('selected');
      }
      self.render();
    });
  };

  Constructor.prototype._visible = function(task) {
    if (!checked('done', task.done)) {
      return false;
    }
    if (!checked('priority', task.priority)) {
      return false;
    }
    if (_.includes(['개인', '가족', '업무'], task.category)) {
      if (!checked('category', task.category)) {
        return false;
      }
    } else if (!checked('category', '기타')) {
      return false;
    }
    return true;
  };

  Constructor.prototype.load = function() {
    var self = this;
    $.getJSON("/tasks", function(data) {
      self.tasks = data;
      self.render();
      self.clearForm();
    });
  };

  Constructor.prototype.render = function() { // li로 변화됨
    var self = this;
    $("#main").toggleClass("no-task", (this.tasks.length <= 0));
    var html = _.map(this.tasks, function(task) {
      if (self._visible(task)) {
        task.doneStr = task.done ? 'done' : '';
        return self.taskTemplate(task);
      }
      return "";
    });
    $("ul.tasks").html(html.join("\n"));
    $("ul.tasks .check").click(self.postDone.bind(this)); // 해당 버튼을 누르면 수행되게 이벤트 바인딩
    $(".task .remove").click(self.removeTask.bind(this));
  };

  Constructor.prototype.clearForm = function() {
    $("#form-task input").val("");
    $("#form-task select[name='category']").val("개인");
    $("#form-task select[name='priority']").val("2");
    $("#form-task input:first").focus();
  };

  Constructor.prototype._findTask = function(e) {
    var el = $(e.currentTarget).closest('li');
    var id = el.data('id');
    return  _.find(this.tasks, {id: id});
  };

  // update
  Constructor.prototype.postDone = function(e) {
    var task = this._findTask(e);
    if (!task) {
      return;
    }
    var self = this; // update 할때는 put 사용
    $.ajax({
      url: '/tasks/' + task.id, // tasks에 update하는 부분으로 가서 put 실행되고 리턴
      method: 'PUT',
      dataType: 'json',
      data: {
        done: task.done ? false : true
      },
      success: function(data) { // ok가 넘어오면 다시 render해줌
        task.done = data.done;
        self.render();
      }
    });
  };

  // crate
  Constructor.prototype.postTask = function() {
    var self = this;
    $.post("/tasks", $("#form-task").serialize(), function(data) { // tasks에 create하는 부분으로가서 생성해줌
      console.log(data);
      self.tasks.push(data);
      self.render();
      self.clearForm();
    });
  };

  // delete
  Constructor.prototype.removeTask = function(e) {
    var task = this._findTask(e);
    if (!task) {
      return;
    }
    var self = this;
    if (confirm('정말로 삭제하시겠습니까?')) {
      $.ajax({
        url: '/tasks/' + task.id,
        method: 'DELETE',
        dataType: 'json',
        success: function(data) {
          self.tasks = _.reject(self.tasks, function(t) {
            return t.id === task.id;
          });
          var el = $(e.currentTarget).closest('li');
          el.remove();
        }
      });
    }
  };

  return Constructor;
} (); // 어떤 함수가 있고 그것을 실행 시킨 것이 taskController
