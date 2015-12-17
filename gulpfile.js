var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),
  clean = require('gulp-clean'),
  jade = require('gulp-jade'),
  minifycss = require('gulp-minify-css'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  runSequence = require('run-sequence'),
  stylus = require('gulp-stylus'),
  uglify = require('gulp-uglify'),
  watch = require('gulp-watch')
  ;

//编译jade模板
gulp.task('jade', function(){
  gulp.src(['./src/view/index.jade'])
    .pipe(jade({
      pretty:true
    }))
    .pipe(gulp.dest('./dist/'));
});

//编译js
gulp.task('script', function(){
  gulp.src('./src/public/js/**/*.js')
    .pipe(gulp.dest('./dist/public/js'))
    //.pipe(rename({suffix: '.min'}))
    //.pipe(uglify())
    //.pipe(gulp.dest('./dist/min/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

//编译样式文件并添加多浏览器样式自动补全
gulp.task('stylus', function () {
  gulp.src('./src/public/css/index.styl')
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/public/css'))
    //.pipe(rename({suffix: '.min'}))
    //.pipe(minifycss())
    //.pipe(gulp.dest('./dist/min/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

//复制图片到指定目录
gulp.task('image', function(){
  gulp.src('./src/public/images/**/*.{png,gif,jpg,svg}')
    .pipe(gulp.dest('./dist/public/images'));
});

//更新文件后浏览器同步
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: "./dist"
    }
  });
});

//创建服务器
gulp.task('server', function(){
  browserSync({
    server: {
      baseDir: "./dist"
    }
  });
});

//设置看守，并在文件发生更改后执行任务
gulp.task('watch', function(){
  watch('./src/view/index.jade', function(){
    gulp.start('jade');
  });
  watch('./src/public/css/**/*.styl', function(){
    gulp.start('stylus');
  });
  watch('./src/public/script/**/*.js', function(){
    gulp.start('script');
  });
  watch('./src/public/images/**/*.{png,gif,jpg,svg}', function(){
    gulp.start('image');
  });

  gulp.watch(['.src/**/*']).on('change', browserSync.reload);
});

//清理dist中文件
gulp.task('clean', function() {
  return gulp.src(['dist/**/*'], {read: false})
    .pipe(clean());
});


// 预设任务
gulp.task('default', runSequence('jade','stylus','script', 'image','watch', 'server'));