/*Main Libraries*/
import fs from "fs";
import gulp from "gulp";
import clean from "gulp-clean";
/*HTML main libraries*/
import gulpChanged from "gulp-changed";
import newer from 'gulp-newer';
import changed from 'gulp-changed';
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import fileInclude from "gulp-file-include";
import webpHtml from 'gulp-webp-html-nosvg';
/*Server main libraries*/
import server from 'gulp-server-livereload';
import sourceMaps from "gulp-sourcemaps";
/*CSS main libraries*/
import sassGlob from "gulp-sass-glob";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import gulpAutoprefixer from "gulp-autoprefixer";
import groupMedia from 'gulp-group-css-media-queries';
import gulpCSSO from 'gulp-csso';
/*Images main libraries*/
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import gulpIf from 'gulp-if';
import recompress from 'imagemin-jpeg-recompress';
import pngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from "imagemin-svgo";
/*JS main libraries*/
import babel from 'gulp-babel';

/*Main functions and variables*/
const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError(
            {title: title, message: 'Error <%= error.message %>', sound:false}
        )
    }
};
const isSvg = (file) => file.extname === '.svg';
const includeFileSettings = {prefix: '@@', basepath: '@file' }
const serverSettings = {livereload: true, open: true}
const sass = gulpSass(dartSass)

/*Remove build folder*/
gulp.task('clean:dev', function(done){
    if(fs.existsSync('./build/')){
        return gulp
            .src('./build/', {read: false})
            .pipe(clean({force: true}));
    }
    done();
})
/*Include HTML files to final directory*/
gulp.task('html:dev', function () {
    return gulp
        .src('./src/*.html')
        .pipe(gulpChanged('./build/', {hasChanged: gulpChanged.compareContents}))
        // .pipe(newer('./build/'))
        .pipe(plumber(plumberNotify('Html')))
        .pipe(fileInclude(includeFileSettings))
        .pipe(webpHtml())
        .pipe(gulp.dest('./build/'));
});
/*Include CSS files to final directory*/
gulp.task('scss:dev', function(){
    return gulp
        .src('./src/scss/*.scss')
        .pipe(gulpChanged('./build/scss/'))
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./build/scss/'))
})
/*Include Images files to final directory*/
gulp.task('images:dev', function (){
    return gulp
        .src('./src/images/**/*', { encoding: false })
        .pipe(gulp.dest('./build/images/old-images/'))
        .pipe(gulpChanged('./build/images/'))
        .pipe(
            imagemin({
                interlaced: true,
                progressive: true,
                optimizationLevel: 5,
                verbose: true
            },[
                recompress({
                    loops: 6,
                    min: 50,
                    max: 90,
                    quality: 'high',
                    use: [pngquant({
                        quality: [0.8, 1],
                        strip: true,
                        speed: 1
                    })],
                }),
                imageminGifsicle(),
                imageminSvgo()
            ])
        )
        .pipe(gulp.dest('./build/images/'))
        .pipe(gulpIf(
            (file) => !isSvg(file),
            webp({ quality: 75 })
        ))
        .pipe(gulp.dest('./build/images/'))
})
/*Include Fonts files to final directory*/
gulp.task('fonts:dev', function (done){
    if(fs.existsSync('./src/fonts/')) {
        return gulp
            .src('./src/fonts/**/*')
            .pipe(gulpChanged('./build/fonts/'))
            .pipe(gulp.dest('./build/fonts/'))
    }
    done();
})
/*Include Files to final directory*/
gulp.task('files:dev', function (done){
    if (fs.existsSync('./src/files/')) {
        return gulp
            .src('./src/files/**/*')
            .pipe(gulpChanged('./build/files/'))
            .pipe(gulp.dest('./build/files/'));
    } else {
        console.log('Папка ./src/files/ не найдена. Задача пропущена.');
        done(); // Завершаем задачу
    }
})
/*Include JS to final directory*/
gulp.task('js:dev', function (){
    return gulp
        .src('./src/js/**/*')
        .pipe(gulpChanged('./src/js/*.js'))
        .pipe(gulp.dest('./build/js/'))
})

/*Include JS to final directory (PROD)*/
gulp.task('js:prod', function () {
    return gulp
        .src('./src/js/**/*.js')
        .pipe(babel({presets: ['@babel/preset-env'],}))
        .pipe(gulp.dest('./build/js'));
});
/*Include CSS to final directory (PROD)*/
gulp.task('scss:prod', function (){
    return gulp
        .src('./src/scss/*.scss')
        .pipe(gulpChanged('./build/scss/'))
        .pipe(plumber(plumberNotify('Styles')))
        .pipe(gulpAutoprefixer())
        .pipe(sassGlob())
        .pipe(groupMedia())
        .pipe(sass())
        .pipe(gulpCSSO())
        .pipe(gulp.dest('./build/scss/'))
})

/*start gulp server*/
gulp.task('server:dev', function (){
    return gulp
        .src('./build/')
        .pipe(server(serverSettings))
})


gulp.task('watch:dev', function (){
    gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
    gulp.watch('./src/images/**/*', gulp.parallel('images:dev'));
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss:dev'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
    gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
})

gulp.task('default', gulp.series('clean:dev', gulp.parallel('html:dev', 'fonts:dev', 'files:dev', 'scss:dev', 'js:dev', 'images:dev'), gulp.parallel('server:dev', 'watch:dev')))
/*start all tasks from production gulp*/
gulp.task('prod', gulp.series('clean:dev', gulp.parallel('html:dev', 'fonts:dev', 'files:dev', 'scss:prod', 'js:prod', 'images:dev'), gulp.parallel('server:dev')))
