var express = require('express'),
    Post = require('../models/Post');
var router = express.Router();

// 폼에 입력한 정보를 관리하기 쉽게 모아놓은 함수
function validateForm(form, options) {
  var title = form.title || "";
  var email = form.email || "";
  var content = form.content || "";
  title = title.trim();
  email = email.trim();
  content = content.trim();

// 필수 값이 빠졌을 경우 처리
  if (!email) {
    return '이메일을 입력해주세요.';
  }

  if (!form.password && options.needPassword) {
    return '비밀번호를 입력해주세요.';
  }

  if (form.password.length < 6) {
    return '비밀번호는 6글자 이상이어야 합니다.';
  }

  if (!title) {
  return '글 제목을 입력해주세요.';
  }

  if (!content) {
  return '글 내용을 입력해주세요.';
  }

  return null;
}

/* get posts list  */
// 디비에서 기존에 존재하는 데이터를 불러온다
router.get('/', function(req, res, next) {
  Post.find({}, function(err, posts) {
    if (err) {
      return next(err);
    }
    res.render('posts/index', {posts: posts});
  });
});

// 글쓰기를 누르면 post/edit를 렌더링시킨다
router.get('/new', function(req, res, next) {
  Post.find({}, function(err, post){
    if(err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});
  });
});

// 수정을 누르면 역시 post/edit를 렌더링시킨다 (edit에서 if문으로 h1을 바꿔주므로)
router.get('/:id/edit', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});
  });
});


/* write a new post */
router.post('/', function(req, res, next) {
  var err = validateForm(req.body,{needPassword: true});
  if (err) {
    return res.redirect('back');
  }
    var newPost = new Post({
      title: req.body.title,
      email: req.body.email,
      content: req.body.content,
    });
    newPost.password = req.body.password;

    newPost.save(function(err) {
      if (err) {
        return next(err);
      } else {
        res.redirect('/');
      }
    });
});

/* modify a post */
router.put('/:id', function(req, res, next) {
  Post.findById({_id: req.params.id}, function(err, post) {
    if (err) {
      return next(err);
    }

     if (post.password !== req.body.password) {
       return res.redirect('back');
     }

    post.title = req.body.title;
    post.email = req.body.email;
    post.content = req.body.content;
    if (req.body.password) {
      post.password = req.body.password;
    }

    post.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/posts');
    });
  });
});

/* delete post */
router.delete('/:id', function(req, res, next) {
  Post.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts');
  });
});

/* read post */
router.get('/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    post.read++;
    post.save();
    res.render('posts/show', {post: post});
  });
});

module.exports = router;
