var express = require('express');
var User = require('../models/User');
var Room = require('../models/Room');
var Book = require('../models/Book');
var router = express.Router();

router.get('/lists/', function(req, res, next) {
  Room.find({}, function(err, rooms) {
    if (err) {
      return next(err);
    }
    res.render('rooms/index', {rooms: rooms});
  });
});
router.get('/new', function(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
});
router.get('/become-a-host', function(req, res, next) {
    if (req.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
    res.render('rooms/become-a-host');
});
router.get('/:id/small-room', function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return next(err);
        }
        res.render('rooms/small-room', {user: user});
    });
});
router.get('/:id/middle-room', function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return next(err);
        }
        res.render('rooms/middle-room', {user: user});
    });
});
router.get('/:id/large-room', function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return next(err);
        }
        res.render('rooms/large-room', {user: user});
    });
});
router.get('/:id/profile', function(req, res, next) {
  Room.findById(req.params.id, function(err, room) {
    if (err) {
      return next(err);
    }
    User.findOne({email: room.email},function(err, user){
      if (err) {
        return next(err);
      }
      res.render('users/show', {user: user});
    });
  });
});
router.get('/:id/edit', function(req, res, next) {
    Room.findById(req.params.id, function(err, room) {
        if (err) {
            return next(err);
        }
        res.render('rooms/edit', {room: room});
    });
});
router.post('/search', function(req, res, next) {
    Room.find({city: req.body.search}, function(err, rooms){
        if (err) {
            return next(err);
        }
        console.log(req.body.search);
        res.render('rooms/index', {rooms: rooms});
    });
});

/* read room */
router.get('/:id', function (req, res, next) {
    Room.findById(req.params.id, function (err, room) {
        if (err) {
            return next(err);
        }
        room.read += 1;
        room.save(function(err){
            if(err){
                return next(err);
            }
        });
        res.render('rooms/show', { room: room });
    });
});
router.get('/:id/host', function (req, res, next) {
    Book.findById(req.params.id, function (err, book) {
        if (err) {
            return next(err);
        }
        Room.findOne({email: book.hostEmail}, function (err, room){
          room.read += 1;
          room.save(function(err){
            if(err){
                return next(err);
            }
        });
        res.render('rooms/show', { room: room });
        });
    });
});
router.post('/', function(req, res, next) {
  Room.findOne({title: req.body.title}, function(err, room) {
    if (err) {
      return next(err);
    }
    if (room) {
      req.flash('danger', '동일한 방이름이 있습니다.');
      res.redirect('back');
    }
    var newRoom = new Room({
      email: req.body.email,
      capacity: req.body.capacity,
      postcode: req.body.postcode,
      city: req.body.city,
      address: req.body.address,
      address2: req.body.address2,
      fee: req.body.fee,
      title: req.body.title,
      content: req.body.content,
      content2: req.body.content2,
      roomtype: req.body.roomtype,
      reservationStatus: "예약가능",
    });

    newRoom.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '방이 등록되었습니다.');
      res.redirect('/');
    });
  });
});

router.put('/:id', function(req, res, next) {
  Room.findById({_id: req.params.id}, function(err, room) {
    if (err) {
      return next(err);
    }
    room.content = req.body.content;
    room.capacity = req.body.capacity;
    room.city = req.body.city;
    room.fee = req.body.fee;
    room.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '숙소 정보가 변경되었습니다.');
      res.redirect('/rooms/lists');
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Room.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    req.flash('success', '등록된 숙소가 삭제되었습니다.');
    res.redirect('/rooms/lists');
  });
});

module.exports = router;
