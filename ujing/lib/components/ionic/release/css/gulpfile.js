var gulp = require('gulp');

gulp.task('ionic-rem', function (done) {
    var fs = require('fs'),
        readline = require('linebyline'),
        read = readline('ionic.css'),
        file = fs.createWriteStream('ionic.rem.less');

    file.on('finish', function () {
        done();
    });

    var regex = /([\d.]+)\s*px/g,
        match;

    read.on('line', function (line) {
        match = regex.exec(line);
        var exLine = line;
        while (match !== null) {
            var num = parseFloat(match[1]);
            if (num > 1 && line.indexOf('@media') === -1) {
                // 100 is the base font-size
                //line = line.replace(match[0], (num / 100) + 'rem');
                var f = line.indexOf('}') === -1;
                exLine += '\n[data-dpr="2"] & {' + line.replace(match[0], (num * 2) + 'px') + (f?'}':'');
                exLine += '[data-dpr="3"] & {' + line.replace(match[0], (num * 3) + 'px') + (f?'}':'');
            }
            match = regex.exec(line);
        }
        file.write(exLine + '\n');
    }).on('close', function () {
        file.end();
    });
});
gulp.task('build-less', ['ionic-rem'], function() {
    var less = require('gulp-less');

    return gulp.src('ionic.rem.less')
        .pipe(less())
        .pipe(gulp.dest('.'));
});
gulp.task('default', function () {
    // 将你的默认的任务代码放在这
    gulp.start('build-less');
});
