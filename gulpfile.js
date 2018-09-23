const gulp = require('gulp');
const del=require('del');
const sass=require('gulp-sass');
const babel=require('gulp-babel');
const rename=require('gulp-rename');
const gulpSequence = require('gulp-sequence');
const replace = require('gulp-replace');
const clean = require('gulp-clean');
const csso = require('gulp-csso');

gulp.task('clean',()=>del(['./dist/**']));

gulp.task('json',()=>gulp.src('./src/**/*.json').pipe(gulp.dest('./dist')));

gulp.task('wxml',()=>gulp.src('./src/**/*.wxml').pipe(gulp.dest('./dist')));

gulp.task('wxs',()=>gulp.src('./src/**/*.wxs').pipe(gulp.dest('./dist')));

gulp.task('assets',()=>gulp.src(['./src/assets/**']).pipe(gulp.dest('./dist/assets')));

gulp.task('sass',()=>dealSass().pipe(gulp.dest('./dist')));

gulp.task('sass:minify',()=>dealSass().pipe(csso()).pipe(gulp.dest('./dist')));

gulp.task('scripts',()=>gulp.src(['./src/**/*.js'])
    .pipe(babel({
        presets:['stage-0','es2015'],
        plugins:['array-includes']
    }))
    .on('error',(e)=>console.log(e))
    .pipe(gulp.dest('./dist'))
)

gulp.task('watch',()=>{
    gulp.watch('./src/**/*.json',['json']);
    gulp.watch('./src/**/*.wxml',['wxml']);
    gulp.watch('./src/**/*.wxs',['wxs']);
    gulp.watch('./src/**/*.{wxss,scss}',['sass']);
    gulp.watch('./src/**/*.js',['scripts']);
    gulp.watch('./src/assets/**',['assets']);
});

gulp.task('dev',gulpSequence(
    ['clean'],
    ['json','assets','wxml','sass','scripts','wxs'],
    ['watch']
));

gulp.task('build',gulpSequence(
    ['clean'],
    ['json','assets','wxml','sass:minify','scripts','wxs']
));

function dealSass() {
    return gulp.src('./src/**/*.{scss,wxss}')
    .pipe(sass().on('error',sass.logError))
    .pipe(replace(/(\/\*\*\s{0,})(@.+)(\s{0,}\*\*\/)/g,($1,$2,$3)=>$3.replace(/\.scss/g,'.wxss')))
    .pipe(rename({
        extname:'.wxss'
    }));
}
